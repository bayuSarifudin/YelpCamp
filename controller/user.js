const User = require('../models/user');

module.exports.regForm = (req, res) => {
	res.render('users/register');
};

module.exports.createUser = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash('success', 'Welcome To The YelpCamp');
			res.redirect('/');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.logForm = (req, res) => {
	res.render('users/login');
};

module.exports.logUser = (req, res) => {
	req.flash('success', 'Welcome Back!');
	const redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logOut = (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye');
	res.redirect('/');
};
