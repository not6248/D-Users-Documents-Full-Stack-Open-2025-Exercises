import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null)
  const [errormessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const findPerson = persons.find((person) => person.name === newName)
    if (findPerson) {
      if(confirm(`${findPerson.name} is already added to phonebiik, repiace the old number with a new one`)){
        const changedPerson = {...findPerson , number:newNumber}
        personService
          .update(findPerson.id,changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== findPerson.id ? person : returnedPerson))
            setNewName("");
            setNewNumber("");
            setMessage(`Updated ${returnedPerson.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000);
          })
          .catch(() => {
            setErrorMessage(`infomation of ${findPerson.name} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000);
          })
      }
      return;
    }

    const person = {
      name: newName,
      number: newNumber,
    };
    personService.create(person).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
      setMessage(`Added ${returnedPerson.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000);
    });
  };

  const deletePerson = (id,name) => {
    if(confirm(`Delete ${name} ?`)){
      personService.deleteData(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id))
      })
    }
  }

  const filterPersons =
    filter.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Notification message={errormessage} isError={true}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={filterPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
