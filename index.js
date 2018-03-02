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

app.post('/products', (req, res) => {
  const product = req.body
  console.log(product)

  // insert the new data into our database
  Product.create(product).then(entity => {

    // send back the 201 Created status and the entity
    res.status(201).send(entity)
  })

})


app.put('/products/:id', (req, res) => {
  const productId = Number(req.params.id)
  const updates = req.body

  // find the product in the DB
  Product.findById(req.params.id)
    .then(entity => {
      // change the product and store in DB
      return entity.update(updates)
    })
    .then(final => {
      // respond with the changed product and status code 200 OK
      res.send(final)
    })
    .catch(error => {
      res.status(500).send({
        message: `Something went wrong`,
        error
      })
    })

})


app.delete('/products/:id', (req, res) => {
  const productId = Number(req.params.id)
  Product.findById(req.params.id)
  .then(entity => {
    // change the product and store in DB
    return entity.destroy()
  })
  .then(_ => {
    // _ is the same as () here, js doesn t care
    // respond with the changed product and status code 200 OK
    res.status(200).send({
      message: 'The product was deleted succesfully'
    })
  })
  .catch(error => {
    res.status(500).send({
      message: `Something went wrong`,
      error
    })
  })
  // delete the product from the DB
  // respond with 200 OK and a message

})
