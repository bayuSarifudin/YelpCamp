const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser    : true,
	useCreateIndex     : true,
	useUnifiedTopology : true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
	console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 200; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			//your user id
			author      : '61344454ff13171ac05ff267',
			location    : `${cities[random1000].city}, ${cities[random1000].state}`,
			geometry    : {
				type        : 'Point',
				coordinates : [ cities[random1000].longitude, cities[random1000].latitude ]
			},
			title       : `${sample(descriptors)} ${sample(places)}`,
			description :
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, enim accusantium eum pariatur nostrum laudantium placeat officiis vero est natus quis sint doloribus officia odio quisquam aliquam asperiores et libero.',
			price       : price,
			images      : [
				{
					url      :
						'https://res.cloudinary.com/dakwft6bt/image/upload/v1631167173/YelpCamp/j0zbtj8oe28czir7v9kg.jpg',
					filename : 'YelpCamp/j0zbtj8oe28czir7v9kg'
				},
				{
					url      :
						'https://res.cloudinary.com/dakwft6bt/image/upload/v1631167173/YelpCamp/pemamvlzi6xnontai2ab.jpg',
					filename : 'YelpCamp/pemamvlzi6xnontai2ab'
				}
			]
		});
		await camp.save();
	}
};

seedDb().then(() => {
	mongoose.connection.close();
});
