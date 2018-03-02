const Router = require('express').Router
const Product = require('./model')

const router = new Router()

router.get('/products', (req, res) => {
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

router.get('/products/:id', (req, res) => {
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

router.post('/products', (req, res) => {
  const product = req.body
  console.log(product)

  // insert the new data into our database
  Product.create(product).then(entity => {

    // send back the 201 Created status and the entity
    res.status(201).send(entity)
  })

})


router.put('/products/:id', (req, res) => {
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


router.delete('/products/:id', (req, res) => {
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

module.exports = router
