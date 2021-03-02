import React from 'react'

const Header = ({ course }) => <h2>{course.name}</h2>

const Total = ({ course }) => {
  const total = course.parts.reduce((accumulator, currentValue) => (accumulator + currentValue.exercises), 0)

  return (
    <p>
      <b>total of {total} exercises</b>
    </p>
  ) 
}
  
const Part = ({ part }) => <p>{part.name} {part.exercises}</p>
  
const Content = ({ course }) => (
  <>
    {course.parts.map( part =>
      <div key={part.id}>
        <Part part={part}/>
      </div>
    )}
  </>
)

const Course = ({ courses }) => (
  <>
    {courses.map(
      course => (
        <div key={course.id}>
          <Header course={course}/>
          <Content course={course} />
          <Total course={course}/>
        </div>
      )
    )}
  </>
)

export default Course;