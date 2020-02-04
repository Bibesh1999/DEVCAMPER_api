const express = require("express");
const { register, login,getMe } = require("./../controllers/authController");
const { protect } = require('./../middleware/auth');
const router = express.Router();

router
    .post("/register", register)
    .post("/login", login)
    .get('/me',protect,getMe);

module.exports = router;
