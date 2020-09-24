require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const User = require('./models/user');
app.use(cors());

const isAuth = require('./middlewares/isAuth');
const attachUserInfo = require('./middlewares/attachUserInfo');

const authRoutes = require('./routes/auth');
const user = require('./models/user');

app.use(express.json());

app.use('/api', authRoutes);
app.get('/api/dashboard', isAuth, attachUserInfo, (req, res) => {
	res.json({ email: req.user.email, validated: req.user.validated });
});

app.get('/confirmation/:token', async (req, res) => {
	try {
		const decoded = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
		const user = await User.findById(decoded.id);
		user.validated = true;
		await user.save();
		res.redirect('http://localhost:4200/dashboard');
	} catch (e) {
		res.send('error');
	}
});

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res
			.status(401)
			.json({ success: false, error: err.name + ': ' + err.message });
		return;
	}
	next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
	console.log(`Server running on port ${PORT}!`);
	const mongoConnection = await mongoose.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	});
	console.log('Database ready!');
});
