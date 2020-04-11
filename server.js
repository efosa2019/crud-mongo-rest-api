const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

mongodb.MongoClient.connect('mongodb://localhost:27017', (error, client) => {
  // Client returned
  var db = client.db('mydb')
  if (error) return process.exit(1)

  app.get('/customers', (req, res) => {
    db.collection('customers')
      .find({}, { sort: { _id: -1 } })
      .toArray((error, customers) => {
        if (error) throw error
        res.send(customers)
      })
  })
  app.post('/customers', (req, res) => {
    let newCustomers = req.body
    db.collection('customers').insert(newCustomers, (error, results) => {
      if (error) throw error
      res.send(results)
    })
  })
  app.put('/customers/:id', (req, res) => {
    db.collection('customers').update(
      { _id: mongodb.ObjectID(req.params.id) },
      { $set: req.body },
      (error, results) => {
        if (error) throw error
        res.send(results)
      }
    )
  })

  app.delete('/customers/:id', (req, res) => {
    db.collection('customers').remove(
      { _id: mongodb.ObjectID(req.params.id) },
      (error, results) => {
        if (error) throw error
        res.send(results)
      }
    )
  })
  app.use(errorhandler())
  app.listen(6500)
})
