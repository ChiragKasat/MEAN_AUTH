require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());

const isAuth = require('./middlewares/isAuth');
const attachUserInfo = require('./middlewares/attachUserInfo');

const authRoutes = require('./routes/auth');

app.use(express.json());

app.use('/api', authRoutes);
app.get('/api/dash', isAuth, attachUserInfo, (req, res) => {
	res.send();
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
