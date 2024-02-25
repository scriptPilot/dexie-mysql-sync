# Dexie MySQL Synchronization

Synchronization between local IndexedDB and MySQL Database.

Powered by [Dexie.js](https://dexie.org/) and [PHP CRUD API](https://github.com/mevdschee/php-crud-api).

## Installation

1. Create a new app project:

    ```bash
    npm create vite
    ```

2. Add a PHP backend:

    ```bash
    npx add-php-backend
    ```

3. Install this package:

    ```bash
    npm install dexie-mysql-sync
    ```

## Usage

Use the sync and wrapper functions exported by `dexie-mysql-sync` in your application store.

The wrapper functions should be used to set the document properties `id`, `$deleted`,
`$updated` and `$synchronized` automatically.

Live queries in Dexie.js can be used with JavaScript, React, Svelte, Vue and Angular as usual.

For synchronization purpose, documents are not deleted from the local database
but have a property `$deleted` which ist set to `true`.

Example `store.js` file:

```js
// Import Dexie.js
import Dexie from 'dexie'

// Import the sync and wrapper functions
import { sync, add, update, remove } from 'dexie-mysql-sync'

// Setup the local database
const db = new Dexie('databaseName')
db.version(1).stores({ tasks: 'id, title' })

// Start the synchronization
sync(db.tasks, 'tasks')

// Export the store functions for the frontend
export function addTask(task) {
  task = typeof task === 'string'
    ? { title: task, done: false }
    : { done: false, ...task }
  return add(db.tasks, task)
}
export function updateTask(id, updates) {
  return update(db.tasks, id, updates)
}
export function removeTask(id) {
  return remove(db.tasks, id)
}
export function tasks() {
  return db.tasks.toArray().filter(doc => !doc.$deleted)
}
```

MySQL tables should have some required extra columns for the synchronization.

Example `schema.sql` file:

```sql
CREATE TABLE IF NOT EXISTS `tasks` (
  -- Required columns
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `$deleted` TINYINT(1) NOT NULL DEFAULT 0,
  `$updated` BIGINT(14) NOT NULL DEFAULT 0,
  `$synchronized` BIGINT(14) NOT NULL DEFAULT 0,
  -- Optional columns
  `title` VARCHAR(255) NOT NULL,
  `done` INTEGER(1) NOT NULL DEFAULT 0
);
```

## Development (this repository)

- Commit changes with an issue (closure) reference
- Run `npm version patch | minor | major` and push changes
- Let the workflow manage the release to GitHub and NPM
