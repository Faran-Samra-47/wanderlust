const mongoose = require('mongoose');
const { type } = require('../schema');
const { object } = require('joi');
const Schema = mongoose.Schema;

// Define a schema for the feedback collection
const feedbackSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:  "User",
    }
});

// Define a model for the feedback collection using the schema
const Review = mongoose.model('Review', feedbackSchema);
module.exports = Review;