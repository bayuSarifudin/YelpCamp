const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.postReview = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash('success', 'You Have Made a Review');
	res.redirect(`/campground/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'You Have Deleted a Review');
	res.redirect(`/campground/${id}`);
};
