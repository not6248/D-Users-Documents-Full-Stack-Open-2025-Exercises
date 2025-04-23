import React, { useEffect, useState } from "react";
import Language from "./Language";
import axios from "axios";

const CountryDetails = ({ countries }) => {
  const [openWeather, setOpenWeather] = useState(null);

  const api_key = import.meta.env.VITE_SOME_KEY;

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${countries.capital}&appid=${api_key}&units=metric`
      )
      .then((response) => {
        setOpenWeather(response.data)
      });
  }, []);

  if (!openWeather) { 
    return null 
  }

  return (
    <>
      <h1>{countries.name.common}</h1>
      <div>Capital {countries.capital}</div>
      <div>Area {countries.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.entries(countries.languages).map(([key, value]) => (
          <Language key={key} langName={value} />
        ))}
      </ul>
      <img src={countries.flags.png} alt="flags" />
      <h2>Weather in {countries.capital}</h2>
      <div>Temperature {openWeather.main.temp} Celsius</div>
      <img src={`https://openweathermap.org/img/wn/${openWeather.weather[0].icon}@2x.png`} alt="icon" />
      <div>Wind {openWeather.wind.speed} m/s</div>
    </>
  );
};

export default CountryDetails;
