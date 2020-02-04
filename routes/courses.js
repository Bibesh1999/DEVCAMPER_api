const express = require("express");
const {
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addCourse
} = require("./../controllers/coursesController");
const Course = require('../models/Course');
const advanceResults = require('../middleware/advanceResults');
const { protect,authorize } = require('./../middleware/auth');
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advanceResults(Course,{
    path: "bootcamp",
    select: "name description"
  }),getCourses)
  .post(protect,authorize('publisher','admin'),addCourse);

router
  .route("/:id")
  .get(getCourse)
  .patch(protect,authorize('publisher','admin'),updateCourse)
  .delete(protect,authorize('publisher','admin'),deleteCourse);
module.exports = router;
