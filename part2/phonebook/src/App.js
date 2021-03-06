import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const infoStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={message.isError ? errorStyle : infoStyle}>
      {message.msg}
    </div>
  )
}

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

const PersonForm = ( {persons, setPersons, setNotificationMessage} ) => {
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
      const personObject = {name: newName, number: newNumber} 
  
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')

          setNotificationMessage(
            {msg: `Added ${personObject.name}`, isError: false}
          )
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
    else {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personObject = {name: newName, number: newNumber} 

        const id = persons.find(person => person.name === personObject.name).id

        console.log("id to be updated", id)

        personService
          .update(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))

            setNotificationMessage(
              {msg: `The number of ${personObject.name} was updated`, isError: false}
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setNotificationMessage(
              {msg: `Information of ${personObject.name} was already removed from server`, isError: true}
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
            setPersons(persons.filter(n => n.id !== id))
          })
      }
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

const Persons = ( {persons, handleClick} ) => {
  return (
    <>
      {persons.map(person => 
          <Person key={person.id} person={person} handleClick={handleClick}/>
      )}
    </>
  )
}

const Person = ( {person, handleClick}  ) => {

  return (
    <div>{person.name} {person.number} <button onClick={() => handleClick(person)}>Delete</button></div>
  )
}



const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ filterName, setFilter ] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const personsToDisplay = filterName === ''
    ? persons
    : persons.filter(person => person.name.search(new RegExp(filterName, 'i')) !== -1)

  const handleDeletePerson = person => {
    if(window.confirm(`Delete ${person.name}?`)) {
      personService
      .deletePerson(person.id)
      .then(response => {
        setPersons(persons.filter(personFilter => personFilter.id !== person.id))
        console.log("delete response", response)

        setNotificationMessage(
          {msg: `Deleted ${person.name}`, isError: false}
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter filterName={filterName} setFilter={setFilter} />

      <h3>add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} setNotificationMessage={setNotificationMessage} />

      <h2>Numbers</h2>
      <Persons persons={personsToDisplay} handleClick={handleDeletePerson}/>
    </div>
  )
}

export default App