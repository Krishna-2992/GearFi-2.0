const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

const assetRoutes = require('./routes/assetRoutes')
const subscriberRoutes = require('./routes/subscriberRoutes')

const app = express()
const port = process.env.PORT

app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose
  .connect(process.env.mongo_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

app.use('/', assetRoutes)
app.use('/', subscriberRoutes)

app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

module.exports = app