const mongoose = require('mongoose')

const assetSchema = new mongoose.Schema({
    nftAddress: {
        type: String,
        required: [true, 'A collection must have a contractAddress'],
    },
    tokenId: {
        type: Number,
        required: [true, 'A collection must have a tokenId'],
    },
    metadata: {
        type: JSON,
    },
    price: {
        type: Number,
    },
    state: {
        type: String,
    },
    owner: {
        type: String,
    }
})

const asset = mongoose.model('asset', assetSchema);

module.exports = asset;
