const express = require('express')
const assetController = require('../controllers/assetController')
const stateController = require('../controllers/stateController')

const router = express.Router()
router
    .route('/assets')
    .get(assetController.getAssets)
    .post(assetController.createAssets)

router.route('/assets/:collectionAddress').get(assetController.getCollection)

router
    .route('/assets/:collectionAddress/:nftId')
    .get(assetController.getSingleAsset)

router.route('/state').patch(stateController.changeState)

module.exports = router
