# MPCollectionChart

This is the basic MOOC Pilot to represent evolution of the activities
of students depending on the time/collection, their first activity and the activity they
have done

## API

### `collections` (object array; required)
`collections` specifies the collection time/datestamp on which the grade collection has been done. Each
collection is an object with the following properties.
- id: an identified for this collection
- filename: (string) ame of the filename containing the collection
- timestamp: (number) the timestamp date of the collection

### `grades` (object array; required)
`grades` is an array of object containing the following properties:
- studentid : student identifier for who this grade is
- activityid: activity identified as in the activity array/table
- value: value of the grade (float)
- collectiond: collection identifier
- cohort: cohort id for this cohort

### `students` (object array; required)
`students` is an array of object containing the following properties:
- id: student id
- username : name of the user
- cohort: array of cohort this user belongs to (integer)
- firstactivecollection: collection id for which we detected the first activity of this student (grade > 0)

### `activities` (object array; required)
`students` is an array of object containing the following properties:
- id: activity id
- name : name of the activity

 
### `studentsSelection` (object array; required)
- array of student id we selected


### `caption` (string or element; optional, default: `null`)
Specifies a descriptive caption to be applied to the entire table.

### `className` (string array; optional; default: `[]`)
Specifies Bootstrap class names to apply to the table. See [Bootstrap's table documentation](https://getbootstrap.com/docs/4.0/content/tables/) for a list of applicable class names.

### `headingClassName` (string array; optional; default: `[]`)
Specifies Bootstrap class names to apply to the table heading. Options are detailed in [Bootstrap's docs](https://getbootstrap.com/docs/4.0/content/tables/#table-head-options).

### `rowHeaderColumnKey` (string; optional)
Specifies the key for the column that should act as a row header. Rather than rendering as `<td>` elements,
cells in this column will render as `<th scope="row">` 
