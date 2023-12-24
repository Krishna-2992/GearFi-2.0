const express = require('express')
const subscriberController = require('../controllers/subscriberController')

const router = express.Router()
router
    .route('/subscriber')
    .post(subscriberController.addSubscriber)

module.exports = router
