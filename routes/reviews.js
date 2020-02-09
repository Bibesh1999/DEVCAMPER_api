const express = require("express");
const {
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  addReview
} = require("./../controllers/reviewController");
const Review = require('../models/Review');
const advanceResults = require('../middleware/advanceResults');
const { protect,authorize } = require('./../middleware/auth');
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advanceResults(Review,{
    path: "bootcamp",
    select: "name description"
  }),getReviews)
  .post(protect,authorize('user','admin'),addReview);

 router
   .route("/:id")  
   .get(getReview)
   .patch(protect,authorize('user','admin'),updateReview)
   .delete(protect,authorize('user','admin'),deleteReview);
module.exports = router;
