///const http = require('http')
const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
morgan.token('body', (req, res) => 
JSON.stringify(req.body))
app.use(express.json())
// NO app.use(morgan('tiny :body'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
]
/*const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
})*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const a = new Date()
    console.log(a)
    //response.send(a)
    response.send(
        `<p>Phonebook has info for ${people.length} people</p>
        <p>${a}</p>`
    )
})

app.get('/api/persons', (request, response) => {
    console.log(people)
    response.json(people)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = people.find(note => note.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    /*response.send(
        people.filter(note => note.id === id)
    )*/
    people = people.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = Math.floor(Math.random() * 20000)
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: `Theres's no number or name. You must put both` 
        })
    }
    //if (people.map(person=>person.name)
    //.includes(body.name))
    if (people.filter(user=>user.name===body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }
    const newPerson = {
        id,
        name: body.name,
        number: body.number
    }
    console.log(body)
    people = people.concat(newPerson)
    console.log(newPerson)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})