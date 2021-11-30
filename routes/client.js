const express = require('express');
const router = express.Router();

const adminController = require('../controller/client');

//Order
router.post('/order',adminController.creatOrder);
module.exports = router;
