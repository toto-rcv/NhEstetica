const express = require('express');
const router = express.Router();
const { register, login, checkAuth, logout } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/check-auth', authenticateToken, checkAuth);
router.post('/logout', logout);

module.exports = router;
