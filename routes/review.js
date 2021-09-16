const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const reviewControl = require('../controller/review');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewControl.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewControl.deleteReview));

module.exports = router;
