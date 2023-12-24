const subscriber = require('../models/subscriber')

exports.addSubscriber = async (req, res) => {
  try {
    console.log('subs', req.body)
    await subscriber.create({email: req.body.subscriber})

    res.status(201).json({
        status: 'successfully added subscriber',
    })
} catch (err) {
    res.status(400).json({
        status: 'fail',
        message: err,
    })
    console.log('💥💥💥', err)
}
}



