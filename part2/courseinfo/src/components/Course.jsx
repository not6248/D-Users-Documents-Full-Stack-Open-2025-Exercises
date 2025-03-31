const Header = ({ course }) => <h1>{course.name}</h1>;

const Content = ({ course }) => (
  <div>
    {course.parts.map((part) => (
      <Part key={part.id} part={part.name} exercises={part.exercises} />
    ))}
  </div>
);

const Part = ({ part, exercises }) => (
  <p>
    {part} {exercises}
  </p>
)

const Total = ({ parts }) => {
  const total = parts.reduce((total,x) => {
    return total += x.exercises
  },0)

  return (
    <p>
      total of {total} exercises
    </p>
  );
};

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content course={course} />
    <Total parts={course.parts} />
  </div>
);

export default Course