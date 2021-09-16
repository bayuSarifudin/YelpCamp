const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review');
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
	url      : String,
	filename : String
});

imageSchema.virtual('thumbnail').get(function() {
	return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema(
	{
		title       : String,
		images      : [ imageSchema ],
		geometry    : {
			type        : {
				type     : String, // Don't do `{ location: { type: String } }`
				enum     : [ 'Point' ], // 'location.type' must be 'Point'
				required : true
			},
			coordinates : {
				type     : [ Number ],
				required : true
			}
		},
		price       : Number,
		description : String,
		location    : String,
		author      : {
			type : Schema.Types.ObjectId,
			ref  : 'User'
		},
		reviews     : [
			{
				type : Schema.Types.ObjectId,
				ref  : 'Review'
			}
		]
	},
	opts
);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
	return `<stong><a href="/campground/${this._id}">${this.title}</a><strong>
	<br>
	<p>${this.description.substring(0, 20)}...</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
	if (doc) {
		await Review.deleteMany({
			_id : {
				$in : doc.reviews
			}
		});
	}
});

module.exports = mongoose.model('Campground', CampgroundSchema);