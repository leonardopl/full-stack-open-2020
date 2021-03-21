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

const CountryName = ( {country} ) => {
  const [ showDetails, setShowDetails ] = useState(false)

  const handleClick = () => {
    setShowDetails(!showDetails)
  }

  if (!showDetails) {
    return (
      <div>
        {country.name} <button onClick={handleClick}>Show</button>
      </div>
    )
  }
  else {
    return (
      <div>
        {country.name} <button onClick={handleClick}>Hide</button>
        <CountryDetailedInfo key={country.alpha3Code} country={country}/>
        <br/>
      </div>
    )
  }
}

const CountryDetailedInfo = ( {country} ) => {
  const api_key = process.env.REACT_APP_API_KEY

  const [ weatherInfo, setWeatherInfo ] = useState([]); 

  useEffect(() => {
    console.log('weather effect')
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
      .then(response => {
        console.log('weather promise fulfilled', response.data)
        setWeatherInfo(response.data)
      })
  }, [api_key, country.capital])

  console.log('weatherInfo array', weatherInfo)

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

      {
        (weatherInfo.length !== 0)
        ? <div>
            <h2>Weather in {country.capital}</h2>
            <p><b>Temperature:</b> {weatherInfo.current.temperature} ºC</p>
            <img src={weatherInfo.current.weather_icons[0]} alt={`${weatherInfo.current.weather_descriptions}`} />
            <p><b>Wind:</b> {weatherInfo.current.wind_speed} mph direction {weatherInfo.current.wind_dir}</p>
          </div>
        : <p>No weather information available at the moment.</p>
      }
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