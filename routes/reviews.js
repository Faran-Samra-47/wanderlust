const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../UTILS/wrapAsyn.js');
const ExpressError = require("../UTILS/ExpressError.js");
const validateSchema = require('../schema');
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const reviewController = require('../Controllers/review.js');

const Validate = (req, res, next) => {
    const { error } = validateSchema.validate(req.body);
    if (error) {
        const errMsg = error.message;
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
  } 
//review
router.post("/",Validate, reviewController.CreateReview);
router.delete('/:reviewId', reviewController.postReview);

module.exports = router;  