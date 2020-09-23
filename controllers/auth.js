const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.register = async (req, res) => {
	const alreadyExists = await User.findOne({ email: req.body.email });

	if (alreadyExists) {
		res.json({
			success: false,
			error: 'Email is already registered'
		});
		return;
	}

	hash = await bcrypt.hash(req.body.password, saltRounds);

	const user = new User({ ...req.body, password: hash });
	user.save((err, user) => {
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			process.env.JWTSECRET,
			{
				expiresIn: '7d'
			}
		);
		if (err) {
			return res.status(400).json({
				success: false,
				err: err,
				message: 'User not saved'
			});
		}
		res.json({
			success: true,
			token
		});
	});
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		res.json({
			success: false,
			message: 'User does not exists. Please register'
		});
		return;
	} else {
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			res.json({
				success: false,
				message: 'Incorrect password'
			});
			return;
		}
		const token = jwt.sign(
			{
				id: user._id,
				email
			},
			process.env.JWTSECRET,
			{
				expiresIn: '7d'
			}
		);

		res.json({success: true, token, user: { email: user.email, id: user._id } });
	}
};

exports.logout = async (req, res) => {};
