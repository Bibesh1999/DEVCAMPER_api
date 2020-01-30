const express = require("express");
const {
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addCourse
} = require("./../controllers/coursesController");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getCourses)
  .post(addCourse);

router
  .route("/:id")
  .get(getCourse)
  .patch(updateCourse)
  .delete(deleteCourse);
module.exports = router;
