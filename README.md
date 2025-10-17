<h3 align="center">PROJECT COMPETITION</h3>
<p align="center">
<a href="#features">Features</a> &nbsp;&bull;&nbsp;
<a href="#tech-stack">Tech Stack</a> &nbsp;&bull;&nbsp;
<a href="#api">API</a> &nbsp;&bull;&nbsp;
<a href="#installation">Installation</a> &nbsp;&bull;&nbsp;
<a href="#usage">Usage</a> &nbsp;&bull;&nbsp;
<a href="#license">License</a>
</p>

## About

A web application that allows users to register, log in, and manage competitions. The application distinguishes between regular users and administrators—with CRUD functionality for competitions, where administrators have additional privileges, such as updating and deleting competitions.

Check out the live demo <a href="https://afga-project-competition.netlify.app/" target="_blank">here</a>.

> **Note**: For demo purposes, role access is restricted by the API. Use `admin@gmail.com` / `admin` for the admin role, or sign up to access the user role.

## Features

- User registration and login
- Dashboard with statistics
- CRUD operations for competitions:
  - Create and read (all users)
  - Update and delete (admin only)
- Role-based access (user vs. admin)

## Tech Stack

- **Frontend:** Angular
- **Styling:** HTML, CSS and, Bootstrap

## API

The application uses a REST API for managing user accounts and competitions.

- **Base URL:** https://api.freeprojectapi.com/api/ProjectCompetition
- **Endpoints:**
  - `POST /register` – Create a new user
  - `POST /login` – Log in a user
  - `GET /getdashboardsummary` – Get statistics for the dashboard
  - `GET /getallcompetition` – Get all competitions
  - `POST /competition` – Create a new competition
  - `PUT /update/:id` – Update a competition (admin only)
  - `DELETE /delete/:id` – Delete a competition (admin only)

> Make sure to have the API running before starting the application.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/angular_project-competition.git
```

2. Navigate into the project folder:

```bash
cd angular_project-competition
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

> The application should now be running at `http://localhost:4200/`. Make sure you have Node.js and Angular CLI installed.

## Usage

- Navigate to the login/sign-up page to create a new account or log in
- Access the dashboard to view statistics
- Create, (admin only) edit, or delete competitions

## License

This project is licensed under the MIT License. See the <a href="https://github.com/afga-dev/angular_project-competition/blob/master/LICENSE.md" target="_blank">LICENSE</a> file for details.
