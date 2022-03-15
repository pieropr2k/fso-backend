///const http = require('http')
require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/Person.js')

app.use(express.static('build'))
app.use(cors())
morgan.token('body', (req, res) =>
  JSON.stringify(req.body))
app.use(express.json())
// NO app.use(morgan('tiny :body'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
/*
let people = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]*/

/*app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})*/

app.get('/info', async (request, response) => {
  const currentDayInfo = new Date()
  console.log(currentDayInfo)
  const peopleLength = await Person.countDocuments({}).exec();
  //console.log(peopleLength, 'people length')
  response.send(
    //`<p>Phonebook has info for ${people.length} people</p>
    `<p>Phonebook has info for ${peopleLength} people</p>
      <p>${currentDayInfo}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  //console.log(people)
  //response.send(people)
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      //console.log(error)
      next(error)
      //response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  // If the next function is called with a parameter, then the execution will continue to the error handler middleware.
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: `There's no number or name. You must put both`
    })
  }
  const foundPerson = await Person.findOne({ "name" : body.name });
  console.log(foundPerson)
  if (foundPerson) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson.save().then(savedPerson => {
    //console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body
  console.log(request.body)
  console.log(number)
  console.log(request.params.id)
  Person.findByIdAndUpdate(request.params.id, { number }, 
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      console.log(updatedNote)
      response.json(updatedNote)
      //response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint. Ej: /api/anythingthatdoesntexists
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// this has to be the last loaded middleware. If something doesn't match with the real data
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})