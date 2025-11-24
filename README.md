<h3 align="center">🏆 PROJECT COMPETITION</h3>
<p align="center">
  A Single Page Application (SPA) built with Angular that allows users to view, search, and manage competitions — with a private dashboard enabling users to create competitions and admins to update or delete them.
</p>

<p align="center">
<a href="#technology-stack"><strong>Technology Stack</strong></a> &nbsp;&bull;&nbsp;
<a href="#key-features"><strong>Key Features</strong></a> &nbsp;&bull;&nbsp;
<a href="#api-and-data-architecture"><strong>API and Data Architecture</strong></a> &nbsp;&bull;&nbsp;
<a href="#live-demo"><strong>Live Demo</strong></a> &nbsp;&bull;&nbsp;
<a href="#deployment"><strong>Deployment</strong></a> &nbsp;&bull;&nbsp;
<a href="#license"><strong>License</strong></a>
</p>

## Technology Stack

This application was developed using a modern, containerized front-end stack centered around Angular for robust architecture and Docker for reliable environment management.

- **Front-End Framework:** Angular (TypeScript)
- **Styling and UI:** Bootstrap and custom styling
- **Data Persistence:** `localStorage`
- **Containerization:** Docker
- **Deployment:** Netlify

## Key Features

- **Competition Management:** View, search, and create competitions through a user-friendly dashboard interface.
- **Role-Based Access:** Admins can create, update, and delete competitions; regular users can create competitions only.
- **Simulated Authentication:** Mock login and registration system using `localStorage` for user session and role management.
- **Dynamic Search:** Persistent search functionality for quickly filtering competitions by title or description.
- **Responsive UI:** Fully responsive layout optimized for desktop, tablet, and mobile devices.
- **Client-Side Persistence:** Uses `localStorage` to maintain user sessions and roles across page reloads.
- **Lazy Loading and Routing:** Efficient navigation between pages using Angular’s routing and lazy-loaded modules.

## API and Data Architecture

This application integrates with the public <a href="https://www.freeprojectapi.com/api.html">Project Competition API</a> to fetch and manage competition and user data, while using client-side persistence to simulate user authentication and role management.

### Data Source

- **Base URL:** `https://api.freeprojectapi.com/api/ProjectCompetition`
- **Endpoints:**
  - `POST /register` – Register a new user
  - `POST /login` – Authenticate a user
  - `GET /getdashboardsummary` – Fetch dashboard summary
  - `POST /competition` – Create a new competition
  - `GET /getallcompetition` – Retrieve all competitions
  - `DELETE /delete/{id}` – Delete a competition
  - `PUT /update/{id}` – Update an existing competition

### Client-Side Persistence Model

Although the API supports CRUD operations, it’s primarily used for fetching data. To simulate a realistic user experience:

- `localStorage`: Stores mock user profiles and roles between sessions.

## Live Demo

Check out the live deployed application <a href="https://afga-project-competition.netlify.app/">here</a>.

> - **Admin:** `admin@afgadev.com` / `4fg4$d3v`
> - **User:** Register any account to access user functionality.

## Deployment

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/angular_project-competition.git
```

2. Navigate into the project folder:

```bash
cd angular-project-competition
```

3. Build the Docker image:

```bash
docker build -t angular-project-competition .
```

4. Run the container:

```bash
docker run -d -p 8080:80 angular-project-competition
```

> The application will be available at `http://localhost:8080/`. Make sure Docker is installed and running on your system.

## License

This project is licensed under the MIT License. See the <a href="https://github.com/afga-dev/angular_project-competition/blob/master/LICENSE.md">LICENSE</a> file for details.
