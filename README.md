# Inventory Manager

A simple application to manage your inventory items with both in-memory and SQLite database storage options.

## Features

- Responsive layout using Bootstrap
- Home page with information about the application
- Inventory management page with CRUD functionality
- Proper routing between pages
- Option to use SQLite database or local storage

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd inventory-manager-api
```

2. Install dependencies:
```
npm install
```

## Running the Application

### Development mode with both Angular app and API server

```
npm run start:dev
```

This will start both the Angular application (on port 4200) and the API server (on port 3000).

### Running just the Angular app (using local storage only)

```
npm start
```

### Running just the API server

```
npm run start:api
```

## Usage

1. Open your browser and navigate to `http://localhost:4200`
2. Use the navigation menu to switch between Home and Inventory pages
3. On the Inventory page, you can:
   - Add new inventory items
   - View existing items
   - Edit items
   - Delete items
   - Toggle between SQLite database and local storage

## Database

The application uses SQLite for persistent storage. The database file is created at `server/inventory.sqlite`.

## Technologies Used

- Angular 19
- Bootstrap 5
- Express.js
- SQLite (via Sequelize ORM)
- Local Storage API

## Additional Angular CLI Commands

### Code scaffolding

```bash
ng generate component component-name
```

### Building for production

```bash
ng build
```

### Running unit tests

```bash
ng test
```

For more information on using the Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
