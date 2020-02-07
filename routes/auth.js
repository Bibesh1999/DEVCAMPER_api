const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,updatePassword
} = require("./../controllers/authController");
const { protect } = require("./../middleware/auth");
const router = express.Router();

router.patch("/resetPassword/:resetToken", resetPassword);
router.patch("/updatedetails",protect, updateDetails);
router.patch("/updatePassword",protect, updatePassword);
router
  .post("/register", register)
  .post("/login", login)
  .get("/me", protect, getMe)
  .post("/forgotpassword", forgotPassword);

module.exports = router;
