import { useState, useEffect } from 'react'

import './App.css'

// if error=>warning katichina props type podanum
import PropTypes from "prop-types";

// Images
import searchIcon from "./assets/search.png"
import sunIcon from "./assets/sun.jpg"
import snowIcon from "./assets/snow.png"
import humidityIcon from "./assets/humidity.png"
import windIcon from "./assets/wind.png"
import drizzleIcon from "./assets/dizzle.png"
import rainIcon from "./assets/rain.png"
// weather details pana porom
const WeatherDetails = ({icon, temp,location,country,lat,log, humidity,wind}) => {
  return (
  <>
    <div className='image'>
      <img src={icon} alt='Image' 
      //style={{ width: "80px", height: "80px" }}
      />
    </div>

    <div className="temp">{temp}°C</div>

    <div className='location'>{location}</div>

    <div className="country">{country}</div>

    <div className="cord">
      <div>
         <span className='lat'>latitude</span>
         <span>{lat}</span>
      </div>
      <div>
         <span className='log'>longitude</span>
         <span>{log}</span>
      </div>
    </div>
    {/* wind kum humitidy vara */}
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt='humidity' className='icon'/>
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>

      <div className="element">
        <img src={windIcon} alt='wind' className='icon'/>
        <div className="data">
          <div className="wind-percent">{wind} km/hr</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
      
    </div>
    
  </>);
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
}


function App() {
  const [icon, setIcon] = useState(snowIcon) ;
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Tirunelveli");
  const [country, setCountry] = useState("INDIA");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [wind,setWind] = useState(0);
  const [humidity,setHumidity] = useState(0);
  const [text,setText] = useState("Tirunelveli");

  const[cityNotFound, setCityNotFound] = useState(false);
  const[loading, setLoading] = useState(false);

  const[error,setError] = useState(null);

  const weatherIconMap = {
    clear: sunIcon,
    cloudy: drizzleIcon,
    rain: rainIcon,
    snow: snowIcon,
  };

  const getIconFromWeatherCode = (weatherCode) => {
    if (weatherCode === 0) return weatherIconMap.clear;
    if ([1, 2, 3, 45, 48].includes(weatherCode)) return weatherIconMap.cloudy;
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
      return weatherIconMap.rain;
    }
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return weatherIconMap.snow;
    return sunIcon;
  };

  // api fetch panrom last ah useState kelsa than podanum
  const search = async () => {
    const cityQuery = text.trim();
    if (!cityQuery) {
      setCityNotFound(true);
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);
    setCityNotFound(false);

  try{
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoRes.ok || !geoData.results || geoData.results.length === 0) {
      setCityNotFound(true);
      return;
    }

    const cityData = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherRes.ok || !weatherData.current) {
      setError("Unable to fetch weather data for this city.");
      return;
    }

    setHumidity(Math.round(weatherData.current.relative_humidity_2m));
    setWind(Math.round(weatherData.current.wind_speed_10m));
    setTemp(Math.round(weatherData.current.temperature_2m));
    setCity(cityData.name);
    setCountry(cityData.country_code || cityData.country || "N/A");
    setLat(cityData.latitude);
    setLog(cityData.longitude);

    const weatherCode = weatherData.current.weather_code;
    setIcon(getIconFromWeatherCode(weatherCode));
    
  }
  catch(error){
    console.error("An error occurred:", error.message);
    setError("An error occurred while fetching weather data.");
  }finally{
    setLoading(false);
  };
}
  
  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }

  // open pana oodane enna katanum ooru peru na
  useEffect(function () {
    search();
  },[])
 
  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type='text' 
          className='cityInput'
           placeholder='Search City' 
           onChange={handleCity} 
           value={text}
           onKeyDown={handleKeyDown}/>
          <div className='search-icon' onClick={ () => search()}>
            <img src={searchIcon} alt='Search' />
          </div>
        </div>


        { !loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} 
        location={city} country={country} lat={lat} log={log}
          wind={wind} humidity={humidity}/> }

 
{loading && <div className='loading-message'>Loading...</div>}
{error && <div className='error-message'>{error}</div>}
{cityNotFound && <div className="city-not-found">City not found</div>}

          <p className='copyright'>
        Designed by <span>Aiswarya</span>
      </p>
      </div>


    </>
  )
}

export default App
