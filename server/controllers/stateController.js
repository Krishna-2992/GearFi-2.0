const assets = require('../models/asset')

exports.changeState = async (req, res) => {
  try {
    console.log(req.body)
    const filter = {
      nftAddress: req.body.nftAddress,
      tokenId: req.body.tokenId,
    }
    const update = {
      state: req.body.state,
      owner: req.body.owner.toLowerCase(),
    }
    console.log('filter', filter)
    console.log('update', update)
    const nft = await assets.findOneAndUpdate(filter, update)
    res.send('State updated')
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}



