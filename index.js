const express = require('express')
const bodyParser = require('body-parser')

const app = express()
// put this just below const app = express()
app.use(bodyParser.json())


var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

const Product = sequelize.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: Sequelize.STRING
}, {
  tableName: 'products',
  timestamps: false
})

app.listen(4001, () => console.log('Express API listening on port 4001'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})

//Product.findById(1).then(product => console.log(JSON.stringify(product)))

app.get('/products', (req, res) => {
  Product.findAll({
    attributes: ['id', 'name', 'price']
  })
    .then(result => {
      // do something with result
      res.json(result)
    })
    .catch(err => {
      // there was an error, return some HTTP error code
      console.error(err)
      //res.status = 500
      res.status(500)
      res.json({message: 'Something went wrong'})
    })
  })

app.get('/products/:id', (req, res) => {
	// ...
  Product.findById(req.params.id)
    .then(result => {
      // do something with result
      if (result) {
        res.json(result)
      } else {
        res.status(404)
        res.json({message:"Not found!"})
      }
    })
    .catch(err => {
      // there was an error, return some HTTP error code
      console.error(err)
      res.status(500)
      res.json({message: 'Oops'})
    })
})
