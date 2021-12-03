const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');
const isAuth = require('../middleware/is-auth');

router.post('/login',authController.login);
router.post('/logout',isAuth,authController.logout);

module.exports = router;