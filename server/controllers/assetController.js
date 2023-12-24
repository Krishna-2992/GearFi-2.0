const assets = require('../models/asset')

exports.getAssets = async (req, res) => {
    // const projection = { nftAddress: 1, owner: 1, price: 1, state: 1 }

    let allAssets
    console.log(req.query)
    if (req.query.owner) {
        allAssets = await assets.find(req.query)
        console.log(allAssets)
    } else {
        allAssets = await assets.find() // await the find() method to ensure it completes
    }
    res.json(allAssets) // Send the entire array of assets as a JSON response
}

exports.createAssets = async (req, res) => {
    try {
        let body = req.body
        for (let i = 1; i < 3; i++) {
            const asset = body
            asset.tokenId = i
            const image = `ipfs://QmchkBgLoYUbF8U7ksWYN847kUCsbkazHfWXv9XAhNxuNN/${i}.avif`
            asset.metadata.imageURI = image
            const newNfts = await assets.create(asset)
            console.log('|')
        }
        console.log('assets created!!✅✅')

        res.status(201).json({
            status: 'success posting',
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        })
        console.log('💥💥💥', err)
    }
}

exports.getCollection = async (req, res) => {
    console.log('yuheee', req.params.collectionAddress)
    const collection = await assets.find({
        nftAddress: req.params.collectionAddress,
        state: { $in: ['LISTED', 'MARGIN_LISTED'] },
    })
    res.json(collection)
}

exports.getSingleAsset = async (req, res) => {
    const collectionAddress = req.params.collectionAddress
    const nftId = req.params.nftId
    const nft = await assets.find({
        nftAddress: collectionAddress,
        tokenId: nftId,
    })
    res.send(nft)
}




// Post requests for different token collections (x8)

// MAYC
// {
//     "nftAddress": "0x9DBFa7c14cfb32b91c61a0B5B23c1CC1796fFBD2",
//     "tokenId": "",
//     "metadata": {
//         "name": "MAYC",
//         "description": "MAYC NFT",
//         "image": "ipfs://Qmca5QTBg7qVhx9jQr5b3qPCkyfLYJ3kZeaNzh35oBHQNe/<tokenId>.avif"
//     },
//     "price": 0.2,
//     "state": "LISTED",
//     "owner": "0x12cec4db3c41283139742ffff9866e2e6df91e53"
// }

// BAYC
// {
//     "nftAddress": "0x63c44637395F93D59Ed4298370183492d89694cF",
//     "tokenId": "",
//     "metadata": {
//         "name": "BAYC",
//         "description": "BAYC NFT",
//         "image": "ipfs://QmcgGyfgFLHHGDKWDk63C6JGcD8RhfZ7DbYBRHiYALdGNP/<tokenId>.avif"
//     },
//     "price": 0.2,
//     "state": "LISTED",
//     "owner": "0x12cec4db3c41283139742ffff9866e2e6df91e53"
// }

// Azuki
// {
//     "nftAddress": "0x5541FF6B03cc2eBF443BeD3Bf3bebF9016A6225F",
//     "tokenId": "",
//     "metadata": {
//         "name": "Azuki",
//         "description": "Azuki NFT",
//         "image": "ipfs://QmQnz2urCiYDKv429cmEjc33eQVWLcVh7bVn4Uj2k2GKq8/<tokenId>.avif"
//     },
//     "price": 0.2,
//     "state": "LISTED",
//     "owner": "0x12cec4db3c41283139742ffff9866e2e6df91e53"
// }

// Otherdeed
// {
//     "nftAddress": "0x920470bF8142a4bB4E960B5f17d79a6A1b7549dD",
//     "tokenId": "",
//     "metadata": {
//         "name": "Otherdeed for Otherside",
//         "description": "Otherdeed for Otherside",
//         "image": "ipfs://QmT6YnKfVfwFV8oBZxJRt9aUCtnWcfMJUXMuLqj4sgvWP3/<tokenId>.avif"
//     },
//     "price": 0.2,
//     "state": "LISTED",
//     "owner": "0x12cec4db3c41283139742ffff9866e2e6df91e53"
// }

// Milady: 
// {
//     "nftAddress": "0xe0939Fb9D1cA59a54B0C809920bb7436Ce69bBE4",
//     "tokenId": "",
//     "metadata": {
//         "name": "Milday-Maker",
//         "description": "Milday-Maker NFT",
//         "image": "ipfs://QmchkBgLoYUbF8U7ksWYN847kUCsbkazHfWXv9XAhNxuNN/<tokenId>.avif"
//     },
//     "price": 0.2,
//     "state": "LISTED",
//     "owner": "0x12cec4db3c41283139742ffff9866e2e6df91e53"
// }

