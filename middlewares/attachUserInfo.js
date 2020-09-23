const User = require('../models/user');

module.exports = async (req, res, next) => {
	try {
		const decodedUser = req.token;
		const user = await User.findById(decodedUser.id);
		if (!user) {
			res.status(401).end();
		}
		req.user = user;
		return next();
	} catch (e) {
		return res.json(e).status(500);
	}
};
