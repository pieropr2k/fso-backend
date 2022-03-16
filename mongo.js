const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

console.log(process.argv)

const url = `mongodb+srv://pieropr2k:${password}@cluster0.l8o3g.mongodb.net/noteApp?retryWrites=true&w=majority`
//`mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)
//console.log(process.argv[3] , process.argv[4])

if (process.argv[3] && process.argv[4]) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  newPerson.save().then(result => {
    //console.log('note saved!')
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    console.log(result)
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}


