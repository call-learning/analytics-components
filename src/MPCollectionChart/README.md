# MPCollectionChart

This is the basic MOOC Pilot to represent evolution of the activities
of students depending on the time/collection, their first activity and the activity they
have done

## API

### `collections` (object array; required)
`collections` specifies the collection time/datestamp on which the grade collection has been done. Each
collection is an object with the following properties.
- filename: (string) ame of the filename containing the collection
- filedate: (string) the date of the collection

### `grades` (object array; required)
`grades` is an array of object containing the following properties:
- studentid : student identifier for who this grade is
- name: name of the grade/activity
- value: value of the grade
- collectid: collection identifier

### `students` (object array; required)
`students` is an array of object containing the following properties:
- username : name of the user
- id: student id
- cohort: cohort this user belongs to
- firstactivecollection: collection id for which we detected the first activity of this student (grade > 0)
 
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
