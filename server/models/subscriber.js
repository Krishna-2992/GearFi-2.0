const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
    }
})

const subscriber = mongoose.model('subscriber', subscriberSchema);

module.exports = subscriber;
