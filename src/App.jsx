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
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("INDIA");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [wind,setWind] = useState(0);
  const [humidity,setHumidity] = useState(0);
  const [text,setText] = useState("Chennai")

  const[cityNotFound, setCityNotFound] = useState(false);
  const[loading, setLoading] = useState(false);

  const[error,setError] = useState(null);

  const weatherIconMap = {
    "01d" : sunIcon,
    "01n" : sunIcon,
    "02d" : sunIcon,
    "02n" : sunIcon,
    "03d" : drizzleIcon,
    "03n" : drizzleIcon,
    "04d" : drizzleIcon,
    "04n" : drizzleIcon,
    "09d" : rainIcon,
    "09n" : rainIcon,
    "10d" : rainIcon,
    "10n" : rainIcon,
    "13d" : snowIcon,
    "13n" : snowIcon,
  };

  // api fetch panrom last ah useState kelsa than podanum
  const search = async () => {
    setLoading(true);
  let api_key = "15795039828ed6452b8b0ef21f617404";
  
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

  try{
    let res = await fetch (url);
    let data = await res.json();
    
    if (data.cod === "404") {
      console.error("City not found");
      setCityNotFound(true);
      setLoading(false);
      return;
    }
    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLog(data.coord.lon);

    // icon sun cloud changa aaka
    const weatherIconCode = data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconCode] || sunIcon);
    
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
