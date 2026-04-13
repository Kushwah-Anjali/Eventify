const db = require("../config/db");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const { name, email, event_id } = req.body; // ✅ MOVE HERE

  try {
    if (!email || !event_id) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields!",
      });
    }

    const documents = JSON.stringify({});
    let finalName = name;

    if (!finalName) {
      const [rows] = await db.query(
        "SELECT name FROM registrations WHERE email = ? AND event_id = ?",
        [email, event_id]
      );

      if (rows.length > 0) {
        finalName = rows[0].name;
      } else {
        return res.status(400).json({
          status: "error",
          message: "Name required for new user",
        });
      }
    }
    const [result] = await db.query(
      "INSERT INTO registrations (event_id, name, email, documents) VALUES (?, ?, ?, ?)",
      [event_id, name, email, documents]
    );

    const [data] = await db.query("SELECT * FROM registrations WHERE id = ?", [
      result.insertId,
    ]);

    return res.json({
      status: "success",
      data: data[0],
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);

    // ✅ HANDLE DUPLICATE
    if (err.code === "ER_DUP_ENTRY") {
      const [rows] = await db.query(
        "SELECT * FROM registrations WHERE email = ? AND event_id = ?",
        [email, event_id]
      );

      return res.status(200).json({
        status: "duplicate",
        message: "User already registered",
        data: rows[0],
      });
    }

    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.checkEmail = async (req, res) => {
  const { email, event_id } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM registrations WHERE email = ? AND event_id = ?",
      [email, event_id]
    );
    if (rows.length > 0) {
      return res.json({
        exists: true,
        data: rows[0],
      });
    }

    return res.json({
      exists: false,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  global.otpStore = global.otpStore || {};
  global.otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: `"Event Manager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Your OTP Code",
      html: `
    <div style="background:#f8f9fa;padding:20px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:20px;text-align:center;">
        
        <h2 style="color:#007bff;">OTP Verification</h2>
        
        <p style="color:#555;">Use the OTP below to complete your registration:</p>
        
        <div style="
          font-size:28px;
          font-weight:bold;
          letter-spacing:4px;
          margin:20px 0;
          color:#007bff;
        ">
          ${otp}
        </div>

        <p style="color:#888;font-size:14px;">
          This OTP is valid for a limited time.
        </p>

        <hr/>
        <p style="color:#888;font-size:12px;">
          Event Manager • Secure Verification 🔐
        </p>
      </div>
    </div>
  `,
    });
    return res.json({ status: "OTP sent" });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send OTP",
    });
  }
};
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (global.otpStore?.[email] == otp) {
    return res.json({ verified: true });
  }
  return res.status(400).json({ verified: false });
};
exports.handleDocuments = async (req, res) => {
  try {
    const { email, event_id } = req.body;

    if (!email || !event_id) {
      return res.status(400).json({
        success: false,
        message: "email and event_id required",
      });
    }

    // 1️⃣ Get existing docs
    const [rows] = await db.query(
      "SELECT documents FROM registrations WHERE email = ? AND event_id = ?",
      [email, event_id]
    );

    let oldDocs = rows.length ? JSON.parse(rows[0].documents || "{}") : {};

    // 2️⃣ If files exist → upload
    let newDocs = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        newDocs[file.fieldname] = file.filename;
      });
    }

    // 3️⃣ Merge
    const finalDocs = { ...oldDocs, ...newDocs };

    // 4️⃣ Save only if new docs uploaded
    if (Object.keys(newDocs).length > 0) {
      if (rows.length) {
        await db.query(
          "UPDATE registrations SET documents = ? WHERE email = ? AND event_id = ?",
          [JSON.stringify(finalDocs), email, event_id]
        );
      } else {
        await db.query(
          "INSERT INTO registrations (email, event_id, documents) VALUES (?, ?, ?)",
          [email, event_id, JSON.stringify(finalDocs)]
        );
      }
    }

    // 5️⃣ Always return status
    res.json({
      success: true,
      uploadedDocs: finalDocs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [rows] = await db.query(
      `SELECT id, name, email, registered_at, documents 
       FROM registrations 
       WHERE event_id = ?`,
      [eventId]
    );

    res.json({
      status: "success",
      users: rows, // <--- FIXED
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
