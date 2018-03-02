const express = require('express')
const bodyParser = require('body-parser')
const productsRouter = require('./products/router')
const app = express()

app.use(bodyParser.json())
app.use(productsRouter)

const port = process.env.PORT || 4001
app.listen(port, () => console.log('Express API listening on port 4001'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})
