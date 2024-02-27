# Dexie MySQL Synchronization

Synchronization between local IndexedDB and MySQL Database.

Powered by [Dexie.js](https://dexie.org/) and [PHP CRUD API](https://github.com/mevdschee/php-crud-api).

## Demo

Install [Docker](https://www.docker.com/) and [Node.js](https://nodejs.org/) and run:

```bash
git clone https://github.com/scriptPilot/dexie-mysql-sync.git
cd dexie-mysql-sync && npm install && cd demo-app && npm install && npm run dev
```

## Installation

1. Create a new app project:

    ```bash
    npm create vite
    ```

2. Add a PHP and MySQL backend:

    ```bash
    npx add-php-backend
    ```
    
3. Install Dexie.js

    ```bash
    npm install dexie
    ```

5. Install this package:

    ```bash
    npm install dexie-mysql-sync
    ```

## Usage

Based on the installation path above.

1. Modify the `schema.sql` file:

    ```sql
    CREATE TABLE `tasks` (

      -- Required columns per table
      `id` VARCHAR(36) NOT NULL PRIMARY KEY,
      `$updated` BIGINT(14) NOT NULL DEFAULT 0,
      `$deleted` TINYINT(1) NOT NULL DEFAULT 0,
      `$synchronized` BIGINT(14) NOT NULL DEFAULT 0,

      -- Optional customized columns per table
      `title` VARCHAR(255) NOT NULL,
      `done` TINYINT(1) NOT NULL DEFAULT 0

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    ```

2. Create a `store.js` file:

    ```js
    // Import Dexie.js
    import Dexie from 'dexie'

    // Import the sync function
    import sync from 'dexie-mysql-sync'

    // Setup the local database
    const db = new Dexie('databaseName')
    db.version(1).stores({ tasks: 'id, title' })

    // Delete the local database and reset the sync in development
    // Ensures to have a clean set of testdata with "npm run dev"
    if (import.meta.env.DEV) {
    Dexie.delete(db.name)
    resetSync()
    }

    // Start the synchronization
    sync(db.tasks, 'tasks')

    // Export the database object
    export db
    ```

Run `npm run dev` and let the magic begin.

Use the database according to the [Dexie.js documentation](https://dexie.org/).

## Function Details

### sync(table, path, options = {})

Starts the synchronization. Multiple browser windows are supported.

- `table`: [Dexie.js Table](https://dexie.org/docs/Dexie/Dexie.%5Btable%5D)
- `path`: `<string>`
    - basic usage
        - MySQL table name, example: `tasks`
    - with sync direction
        - prefix `to:` to sync only from local to remote, example: `to:tasks`
        - prefix `from:` to sync only from remote to local, example: `from:tasks`
    - with result reduction, effects only the remote to local sync
        - [filter](https://github.com/mevdschee/php-crud-api?tab=readme-ov-file#filters), example: `tasks?filter=done,eq,0`
        - [column selection](https://github.com/mevdschee/php-crud-api?tab=readme-ov-file#column-selection), example: `tasks?include=id,title`
        - [other ...](https://github.com/mevdschee/php-crud-api?tab=readme-ov-file#list)
- `options`: `<object>` *optional*
    - `endpoint`: `<string>`, [PHP CRUD API](https://github.com/mevdschee/php-crud-api?tab=readme-ov-file#installation) endpoint, internal or external, default `/api.php`
    - `interval`: `<number>`, default `1000` milliseconds

### resetSync(database)

Resets all synchronizations. All local and remote documents are synchronized again.

- `database`: [Dexie.js Database](https://dexie.org/docs/Dexie/Dexie)

## Maintainer

- Commit changes with an issue (closure) reference
- Run `npm version patch | minor | major` and push changes
- Let the workflow manage the release to GitHub and NPM
