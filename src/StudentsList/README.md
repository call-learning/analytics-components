# StudentsList

This is the basic MOOC Pilot to represent evolution of the activities
of students depending on the time/collection, their first activity and the activity they
have done

## API

### `students` (object array; required)
`students` is an array of object containing the following properties:
- id: student id
- username : name of the user
- cohort: array of cohort this user belongs to
- firstactivecollection: collection id for which we detected the first activity of this student (grade > 0)


### `studentsid` (object array; required)
`studentsid` is an array of integers pointing to the unique identifier of student

