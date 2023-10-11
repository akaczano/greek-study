# Greek study tool


To-Do List

### Finish project setup
1. Add react-bootstrap with theme
2. Finish building out electron app
3. Make sure app can read from DB

### Build system
Add a Makefile to do the following:

- Command to startup development version
- Command to run tests
- Command to reset test DB
- Command to package electron app

### Implement backend

- Add a separate DAO file for each entity
- Add appropriate handlers to call all operations for each entity
- Add test file for each entity

The entities are:

1. Group
  - Load list
  - Add group
  - Rename (update) group
  - Remove group
2. Term
  - Add a term
  - Load list (with filter, offset, limit)
  - Update term
  - Remove term
3. Group detail
  - Add term to group
  - Remove term from group
  - Get groups for term

Testing should...

1. Check that every operation works
  - Make sure that the complete entity with ID is returned from inserts
2. Check failure cases
  - Missing inputs
  - Foreign key violations

### Implement Front-end

Slices:

1. groupSlice
  - List of groups
  - Loading flag
  - Posting flag
  - Group being renamed
  - Group(s) being removed
  - Current dirty group name
  - Error status
2. termSlice
  - List of terms (with group info)
  - Offset and limit info
  - Filter info
  - Loading flag
  - Posting flag
  - Dirty term
  - Term(s) being deleted


Component list:

1. Landing screen
2. Groups Panel
  - List group
  - Buttons
  - Search bar?
3. Add group modal
4. Terms panel
  - Pagination
  - Terms control
5. Terms control
  - Filter inputs
6. Terms list view
7. Add term modal
