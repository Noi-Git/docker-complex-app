const keys = require('./keys')

// Express App setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Connect to the running Postgress server
const { Pool } = require('pg')
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
})
pgClient.on('error', () => console.log('Lost PG connection'))

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => console.log(err))

// Redis Client setup
// retry_strategy 1000 -- means try to connect every 1000 second if lost connection
const redis = require('redis')
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
})
const redisPublisher = redisClient.duplicate()

// Express route handlers
app.get('/', (req, res) => {
  res.send('Hi')
})
// retrive all the value have ever submitted to postgres
app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values')

  res.send(values.rows)
})

// retrive all values and all indices that have ever been submitted to the backend
app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values)
  })
})

// receive new value from React application
app.post('/values', async (req, res) => {
  const index = req.body.index

  if (parseInt(index) > 40) {
    return res.status(422).send('The index is too high')
  }

  // put the value received into Redis data store
  redisClient.hset('values', index, 'Nothing yet!')

  //sending the input(index - we call message) to the worker process
  //basically - pull the new value ot of Redis and start calculating
  redisPublisher.publish('insert', index)

  //add new index that just submitted into database
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true })
})

app.listen(5001, (err) => {
  console.log('Listinging')
})
