const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("./../controllers/userController");
const User = require("../models/User");
const advanceResults = require("../middleware/advanceResults");

const { protect, authorize } = require("./../middleware/auth");

const router = express.Router();
router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(advanceResults(User), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUsers)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
