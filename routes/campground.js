const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campControl = require('../controller/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
	.route('/')
	.get(catchAsync(campControl.index))
	.post(
		isLoggedIn,
		upload.array('campground[image]'),
		validateCampground,
		catchAsync(campControl.createCamp)
	);

router.get('/new', isLoggedIn, campControl.newForm);

router
	.route('/:id')
	.get(catchAsync(campControl.show))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array('campground[image]'),
		validateCampground,
		catchAsync(campControl.editCamp)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campControl.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campControl.editForm));

module.exports = router;
