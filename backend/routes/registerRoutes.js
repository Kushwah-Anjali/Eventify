const express = require("express");
const router = express.Router();
const { checkEmail, register,handleDocuments,getEventRegistrations,sendOtp, verifyOtp } = require("../controllers/registerController");
const upload = require("../middleware/multer");
router.post("/check-email", checkEmail);
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp",verifyOtp);
router.post(
  "/handle-documents",
  upload.any(),
  handleDocuments
);
router.get("/:eventId/registrations", getEventRegistrations);
module.exports = router;
