const express = require('express');
const router = express.Router();

const clientController = require('../controller/client');

//Order
router.post('/order',clientController.createOrder);
router.get('/order',clientController.getOrder)
module.exports = router;
