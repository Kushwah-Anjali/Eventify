import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUserPlus, FaEnvelope, FaKey, FaUser } from "react-icons/fa";

const Base_url = process.env.REACT_APP_API_URL;

export default function RegisterModal({ show, handleClose, eventId }) {
  const [step, setStep] = useState("email");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const resetState = () => {
    setStep("email");
    setEmail("");
    setName("");
    setOtp(""); // ✅ ADD THIS
    setIsExistingUser(false);
  };
  const sendOtp = async () => {
    const res = await fetch(`${Base_url}/api/register/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "OTP sent") {
      throw new Error(data?.message || "OTP failed");
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await fetch(`${Base_url}/api/register/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!data.verified) {
        Swal.fire("Error", "Invalid OTP", "error");
        return;
      }

      // OTP verified → proceed to register
      const registerRes = await fetch(`${Base_url}/api/register/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: isExistingUser ? null : name,
          event_id: eventId,
        }),
      });

      const registerData = await registerRes.json();

      // Handle backend error
      if (!registerRes.ok || registerData.status === "error") {
        Swal.fire(
          "Error",
          registerData.message || "Registration failed",
          "error"
        );
        return;
      }

      // Decide UI based on backend response
      const isDuplicate = registerData.status === "duplicate";

      const title = isDuplicate ? "Already Registered" : "Success";
      const message = isDuplicate
        ? "You are already registered. Redirecting to details page..."
        : "Registered successfully";

      // Show alert FIRST, then navigate
      await Swal.fire(title, message, "success");

      handleClose();

      navigate("/register-details", {
        state: {
          name: registerData.data.name,
          email,
          eventId,
          status: registerData.status,
          registered_at: registerData.data.registered_at,
        },
      });
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);
      Swal.fire("Error", "Something went wrong. Try again.", "error");
    }
  };
  const handleEmailCheck = async () => {
    if (!email.trim()) {
      Swal.fire("Warning", "Email required", "warning");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${Base_url}/api/register/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          event_id: eventId,
        }),
      });
      const data = await res.json();
      if (typeof data.exists !== "boolean") {
        throw new Error("Invalid response from server");
      }
      if (data.exists) {
        setIsExistingUser(true);
        await sendOtp();

        setStep("otp");
      } else {
        setIsExistingUser(false);
        setStep("name"); // ask name
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleNameSubmit = async () => {
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name required",
      });
      return;
    }

    try {
      setLoading(true);

      await sendOtp(); // ✅ same function reused
      setStep("otp");
    } catch (err) {
      Swal.fire("Error", "OTP failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetState();
        handleClose();
      }}
      centered
      backdrop="static"
    >
      <Form className="rounded-4 shadow-sm">
        <div className="modal-header bg-primary text-white rounded-top">
          <h5 className="modal-title fw-bold d-flex align-items-center gap-2 ms-2">
            <FaUserPlus className="text-light" />
            Register
          </h5>

          <Button
            variant="close"
            onClick={() => {
              resetState();
              handleClose();
            }}
            className="btn-close-white"
          ></Button>
        </div>

        <Modal.Body className="px-4">
          {step === "email" && (
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                <FaEnvelope /> Email
              </Form.Label>{" "}
              <Form.Control
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          )}
          {step === "name" && (
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center gap-2">
                <FaUser /> Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          )}

          {step === "otp" && (
            <Form.Group>
              <Form.Label className="d-flex align-items-center gap-2">
                <FaKey />
                Enter OTP
              </Form.Label>{" "}
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button
              variant="primary"
              onClick={
                step === "email"
                  ? handleEmailCheck
                  : step === "name"
                    ? handleNameSubmit
                    : step === "otp"
                      ? handleVerifyOtp
                      : null
              }
              disabled={
                loading ||
                (step === "email" && !email.trim()) ||
                (step === "name" && !name.trim())
              }
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Processing...
                </>
              ) : step === "otp" ? (
                "Next"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
