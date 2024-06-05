const Listing = require('../models/listing');
const Review = require("../models/review.js");

module.exports.CreateReview = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        // Assuming Review is imported or defined somewhere
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","Review Added Successfully");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error("Error creating review:", err);
        res.status(500).send("Error creating review");
    }
  };

  module.exports.postReview = async(req,res)=>{
    let{id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Succesfully");
    res.redirect(`/listings/${id}`)
};