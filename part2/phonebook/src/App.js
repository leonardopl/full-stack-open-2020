import React, { useState } from 'react'

const Filter = ({ filterName, setFilter }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      filter shown with: <input
                            value={filterName}
                            onChange={handleFilterChange}/>
    </div>
  )
}

const PersonForm = ( {persons, setPersons} ) => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
 
  const addPerson = (event) => {
    event.preventDefault()

    if (!persons.some(person => person.name === newName))
    {
      setPersons(persons.concat( {name: newName, number: newNumber} ))
      setNewName('')
      setNewNumber('')
    }
    else {
      alert(`${newName} is already added to phonebook`)
    }
  }
  
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
                value={newName}
                onChange={handleNameChange}/>
      </div>
      <div>
        number: <input
                  value={newNumber}
                  onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form> 
  )
}

const Persons = ( {persons} ) => {
  return (
    <>
      {persons.map(person => 
          <Person key={person.name} person={person} />
      )}
    </>
  )
}

const Person = ( {person} ) => <div>{person.name} {person.number}</div>

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [ filterName, setFilter ] = useState('')

  const personsToDisplay = filterName === ''
    ? persons
    : persons.filter(person => person.name.search(new RegExp(filterName, 'i')) !== -1)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} setFilter={setFilter} />

      <h3>add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} />

      <h2>Numbers</h2>
      <Persons persons={personsToDisplay} />
    </div>
  )
}

export default App