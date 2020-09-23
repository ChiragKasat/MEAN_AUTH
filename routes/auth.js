const express = require('express');
const router = express.Router();
const { logout, register, login } = require('../controllers/auth');

router.post('/register', register);

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;
