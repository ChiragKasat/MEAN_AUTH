const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const saltRounds = 10;
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

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
	jwt.sign(
		{
			id: user._id
		},
		process.env.EMAIL_SECRET,
		{
			expiresIn: '1d',
		},
		(err, emailToken) => {
			const port = process.env.PORT||3000;
			const url = `http://localhost:${port}/confirmation/${emailToken}`;

			transporter.sendMail({
				to: user.email,
				subject: 'Confirm Email',
				html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
			});
		},
	);
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
				expiresIn: '1d'
			}
		);

		res.json({success: true, token, user: { email: user.email, id: user._id } });
	}
};

exports.logout = async (req, res) => {};
