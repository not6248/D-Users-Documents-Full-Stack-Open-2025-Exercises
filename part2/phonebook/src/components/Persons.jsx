import React from "react";

const Persons = ({persons}) => {
  return (
    <>
      {persons.map((persons) => (
        <div key={persons.name}>
          {persons.name} {persons.number}
        </div>
      ))}
    </>
  );
};

export default Persons;
