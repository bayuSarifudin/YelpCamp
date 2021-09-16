const Campground = require('../models/campground');
const Review = require('../models/review');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
};

module.exports.newForm = (req, res) => {
	res.render('campgrounds/new');
};

module.exports.createCamp = async (req, res, next) => {
	// if (!req.body.campground) {
	// 	throw new ExpressError('Invalid Campground', 400);
	// }
	const geoData = await geocoder
		.forwardGeocode({
			query : req.body.campground.location,
			limit : 1
		})
		.send();
	const campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);
	req.flash('success', 'Successfully Made a New Campground!');
	res.redirect(`/campground/${campground._id}`);
};

module.exports.show = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id)
		.populate({
			path     : 'reviews',
			populate : {
				path : 'author'
			}
		})
		.populate('author');
	if (!campground) {
		req.flash('error', 'Campground Not Found');
		return res.redirect('/campground');
	}
	res.render('campgrounds/show', { campground });
};

module.exports.editForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash('error', 'Campground Not Found');
		return res.redirect('/campground');
	}
	res.render('campgrounds/edit', { campground });
};

module.exports.editCamp = async (req, res) => {
	if (!req.body.campground) {
		throw new ExpressError('Invalid Campground', 400);
	}
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	await campground.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
	}
	req.flash('success', 'Successfully Updated Campground');
	res.redirect(`/campground/${campground._id}`);
};

module.exports.deleteCamp = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndDelete(id);
	req.flash('success', 'You Have Deleted a Campground');
	res.redirect('/campground');
};
