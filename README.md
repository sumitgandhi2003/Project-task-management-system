# Project and Task Management App

A full-stack Project and Task Management system that allows users to create and manage projects, assign tasks, set priorities and statuses, and collaborate in teams with role-based access control.

## Features

- User Registration and Login (with JWT authentication)
- Role-based access: Admin and Team Member
- Create,
- Assign tasks to multiple users
- Filter and sort tasks by status or priority
- Priority levels: Low, Medium, High, Urgent
- Task status tracking: To Do, In Progress, Completed
- Responsive UI with Tailwind CSS

## Tech Stack

### Frontend

- React.js
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Cloudinary (if image/file upload is supported)

## Installation

### Clone the repository

```bash
git clone https://github.com/sumitgandhi2003/Project-task-management-system.git
cd project-task-management

Backend Setup

cd server
npm install

Create a .env file in the server/ directory:

PORT=port
DB_URL=mongodb_connection_string
DB_NAME=DB_NAME
JWT_SECRET=secret_key
CROSS_ORIGIN_URL= frontend URL
Then run the backend:

npm run dev

Frontend Setup

cd client
npm install
npm start


Create a .env file in the frontend/ directory:

VITE_SERVER_URL: SERVER_URL
```

---

## Live Deployment

- Frontend: https://project-task-management-system-iota.vercel.app
- Backend API: https://project-task-management-system-backend.vercel.app

---

## EndPoints

#### **Auth**

- `POST /api/v1/auth/register` – Register a new user
- `POST /api/vi/auth/login` – Login and receive JWT

#### **User**

- `GET /api/vi/auth/check-auth` – Get current user profile

#### **Projects**

- `POST /api/v1/project/create-project` – Create project
- `GET /api/v1/project/get-projects` – Get all projects
<!-- - `GET /api/projects/:id` – Get project by ID
- `PUT /api/projects/:id` – Update project
- `DELETE /api/projects/:id` – Delete project -->

#### **Tasks**

- `POST /api/v1/task/create-task` – Create task
- `GET /api/v1/task/get-all-task` – Get all tasks
<!-- - `GET /api/tasks/:id` – Get task by ID
- `PUT /api/tasks/:id` – Update task
- `DELETE /api/tasks/:id` – Delete task -->
