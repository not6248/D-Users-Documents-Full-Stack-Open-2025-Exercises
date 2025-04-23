import { useEffect,useState } from "react";
import axios from 'axios';
import CountryDetails from "./components/CountryDetails";
import Countries from "./components/Countries";

function App() {
  const [restCountries,setRestCountries] = useState([])
  const [countries,setCountries] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setRestCountries(response.data)
      })
  },[])
  
  const handleOnchange = (event) =>{
    setCountries(event.target.value)
  }

  const handleShow = (name) => {
    setCountries(name)
  }

  const findCountries = restCountries.filter(countrie => countrie.name.common.toLowerCase().includes(countries.toLowerCase()))


  return (
  <>
    <div>
      find contries <input value={countries} onChange={handleOnchange} />
    </div>
    {
      findCountries.length > 10 
      ? 'Too many matches, specify another filter' 
      : findCountries.length == 1 
        ? <CountryDetails countries={findCountries[0]}/>
        : <Countries countries={findCountries} handleShow={handleShow}/>
    }
  </>
  )
}

export default App;
