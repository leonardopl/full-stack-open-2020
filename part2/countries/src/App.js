import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filterName, setFilter }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <p>
      Find countries: <input
                            value={filterName}
                            onChange={handleFilterChange}/>
    </p>
  )
}

const Countries = ( {countries} ) => {
  if(countries.length === 1)
  {
    return(
      <>
        {countries.map(country =>
          <CountryDetailedInfo key={country.alpha3Code} country={country} />
        )}
      </>
    )
  } else if(countries.length < 10)
  {
    return(
      <>
        {countries.map(country =>
          <CountryName key={country.alpha3Code} country={country} />
        )}
      </>
    )
  } else {
    return(
      <div>Too many matches, please specify another filter</div>
    )
  }
}

const CountryName = ( {country} ) => <div>{country.name}</div>

const CountryDetailedInfo = ( {country} ) => {
  return (
    <>
      <h1>{country.name}</h1>
      <div><b>Capital:</b> {country.capital}</div>
      <div><b>Population:</b> {country.population.toLocaleString()}</div>

      <h2>Languages</h2>
      <ul>
        {country.languages.map(language =>
            <li key={language.iso639_2}> {language.name}</li>
          )}
      </ul>

      <img src={country.flag} alt={`${country.name}'s flag`} height="100"/>
    </>
  )
}


const App = () => {
  const [ countries, setCountries ] = useState([])

  const [ filterName, setFilter ] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const countriesToDisplay = filterName === ''
    ? []
    : countries.filter(country => country.name.search(new RegExp(filterName, 'i')) !== -1)

  return (
    <div>
      <h1>Countries</h1>
      <Filter filterName={filterName} setFilter={setFilter} />

      <Countries countries={countriesToDisplay} />
    </div>
  )
}

export default App