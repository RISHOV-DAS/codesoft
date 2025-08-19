# Project Management API Backend

A comprehensive RESTful API for project and task management built with Node.js, Express, and PostgreSQL using Prisma ORM.

## 🚀 Features

- **User Authentication & Authorization**

  - User registration
  - JWT-based authentication
  - Password hashing with bcrypt

- **Project Management**

  - Create, read, update, and delete projects
  - Project status tracking (todo, inprogress, completed, overdue)
  - Project date management (start/end dates)
  - Project description management

- **Task Management**

  - Create, read, update, and delete tasks within projects
  - Task assignment and status tracking
  - Task date management
  - Hierarchical project-task relationship

- **Database**
  - PostgreSQL database with Prisma ORM
  - Automatic migrations
  - Relationship management between users, projects, and tasks

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to backend folder**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="24h"


   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npm run prisma:seed
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication Endpoints

#### 1. User Registration

- **POST** `/api/auth/register`
- **Description**: Register a new user
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "msg": "Registered successfully"
  }
  ```

<!-- Email verification removed -->

#### 2. User Login

- **POST** `/api/auth/login`
- **Description**: Authenticate user and return JWT token
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "msg": "Logged in successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 3. Get User by ID

- **GET** `/api/auth/user/:id`
- **Description**: Retrieve user information by ID
- **Parameters**: `id` (user ID)
- **Response**:
  ```json
  {
    "id": "user-uuid",
    "email": "user@example.com"
  }
  ```

#### 4. User Logout

- **POST** `/api/auth/logout`
- **Description**: Logout user (client-side token clearing)
- **Response**:
  ```json
  {
    "msg": "Logout successful (client clears token)"
  }
  ```

### Project Management Endpoints

#### 1. Create Project

- **POST** `/api/projects/create`
- **Description**: Create a new project with optional tasks
- **Body**:
  ```json
  {
    "userId": "user-uuid",
    "projectData": {
      "title": "My Project",
      "description": "Project description",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.999Z",
      "status": "todo",
      "tasks": [
        {
          "content": "Task 1",
          "assignedTo": "John Doe",
          "startDate": "2024-01-01T00:00:00.000Z",
          "endDate": "2024-01-15T23:59:59.999Z",
          "status": "todo"
        }
      ]
    }
  }
  ```
- **Response**:
  ```json
  {
    "msg": "Project created successfully",
    "project": {
      "id": 1,
      "title": "My Project",
      "description": "Project description",
      "status": "todo",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.999Z",
      "userId": "user-uuid",
      "task": [...],
      "user": {...}
    }
  }
  ```

#### 2. Get Projects for User

- **GET** `/api/projects/:userId`
- **Description**: Retrieve all projects for a specific user
- **Parameters**: `userId` (user ID)
- **Response**:
  ```json
  {
    "projects": [
      {
        "id": 1,
        "title": "My Project",
        "description": "Project description",
        "status": "todo",
        "startDate": "2024-01-01T00:00:00.000Z",
        "endDate": "2024-12-31T23:59:59.999Z",
        "task": [...]
      }
    ]
  }
  ```

#### 3. Get Project by ID

- **GET** `/api/projects/:userId/:projectId`
- **Description**: Retrieve a specific project with its tasks
- **Parameters**: `userId` (user ID), `projectId` (project ID)
- **Response**:
  ```json
  {
    "id": 1,
    "title": "My Project",
    "description": "Project description",
    "status": "todo",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.999Z",
    "task": [...],
    "user": {...}
  }
  ```

#### 4. Update Project Title

- **PUT** `/api/projects/:userId/:projectId/title`
- **Description**: Update project title
- **Parameters**: `userId` (user ID), `projectId` (project ID)
- **Body**:
  ```json
  {
    "title": "Updated Project Title"
  }
  ```

#### 5. Update Project Description

- **PUT** `/api/projects/:userId/:projectId/description`
- **Description**: Update project description
- **Parameters**: `userId` (user ID), `projectId` (project ID)
- **Body**:
  ```json
  {
    "description": "Updated project description"
  }
  ```

#### 6. Update Project Start Date

- **PUT** `/api/projects/:userId/:projectId/start-date`
- **Description**: Update project start date
- **Parameters**: `userId` (user ID), `projectId` (project ID)
- **Body**:
  ```json
  {
    "startDate": "2024-02-01T00:00:00.000Z"
  }
  ```

#### 7. Update Project End Date

- **PUT** `/api/projects/:userId/:projectId/end-date`
- **Description**: Update project end date
- **Parameters**: `userId` (user ID), `projectId` (project ID)
- **Body**:
  ```json
  {
    "endDate": "2024-11-30T23:59:59.999Z"
  }
  ```

#### 8. Update Project Status

- **PUT** `/api/projects/:userId/:projectId/status`
- **Description**: Update project status
- **Parameters**: `userId` (user ID), `projectId` (project ID)
- **Body**:
  ```json
  {
    "status": "inprogress"
  }
  ```
- **Valid Status Values**: `todo`, `inprogress`, `completed`, `overdue`

#### 9. Delete Project

- **DELETE** `/api/projects/:userId/:projectId`
- **Description**: Delete a project and all its associated tasks
- **Parameters**: `userId` (user ID), `projectId` (project ID)
- **Response**:
  ```json
  {
    "msg": "Project deleted successfully"
  }
  ```

### Task Management Endpoints

#### 1. Create Task

- **POST** `/api/tasks/create`
- **Description**: Create a new task within a project
- **Body**:
  ```json
  {
    "userID": "user-uuid",
    "projectID": "1",
    "taskData": {
      "content": "Task description",
      "assignedTo": "John Doe",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-15T23:59:59.999Z",
      "status": "todo"
    }
  }
  ```

#### 2. Get Tasks for Project

- **GET** `/api/tasks/:userID/projects/:projectID/tasks`
- **Description**: Retrieve all tasks for a specific project
- **Parameters**: `userID` (user ID), `projectID` (project ID)
- **Response**:
  ```json
  [
    {
      "id": 1,
      "content": "Task description",
      "assignedTo": "John Doe",
      "status": "todo",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-15T23:59:59.999Z",
      "projectId": 1
    }
  ]
  ```

#### 3. Get Task by ID

- **GET** `/api/tasks/:userID/projects/:projectID/tasks/:taskID`
- **Description**: Retrieve a specific task
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)

#### 4. Update Task Status

- **PUT** `/api/tasks/:userID/projects/:projectID/tasks/:taskID/status`
- **Description**: Update task status
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)
- **Body**:
  ```json
  {
    "status": "inprogress"
  }
  ```

#### 5. Update Task Title/Content

- **PUT** `/api/tasks/:userID/projects/:projectID/tasks/:taskID/title`
- **Description**: Update task content
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)
- **Body**:
  ```json
  {
    "content": "Updated task content"
  }
  ```

#### 6. Update Task Description

- **PUT** `/api/tasks/:userID/projects/:projectID/tasks/:taskID/description`
- **Description**: Update task description
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)
- **Body**:
  ```json
  {
    "content": "Updated task description"
  }
  ```

#### 7. Update Task Assignment

- **PUT** `/api/tasks/:userID/projects/:projectID/tasks/:taskID/assign`
- **Description**: Update task assignment
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)
- **Body**:
  ```json
  {
    "assignedTo": "Jane Smith"
  }
  ```

#### 8. Update Task Start Date

- **PUT** `/api/tasks/:userID/projects/:projectID/tasks/:taskID/start-date`
- **Description**: Update task start date
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)
- **Body**:
  ```json
  {
    "startDate": "2024-01-05T00:00:00.000Z"
  }
  ```

#### 9. Update Task End Date

- **PUT** `/api/tasks/:userID/projects/:projectID/tasks/:taskID/end-date`
- **Description**: Update task end date
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)
- **Body**:
  ```json
  {
    "endDate": "2024-01-20T23:59:59.999Z"
  }
  ```

#### 10. Delete Task

- **DELETE** `/api/tasks/:userID/projects/:projectID/tasks/:taskID`
- **Description**: Delete a specific task
- **Parameters**: `userID` (user ID), `projectID` (project ID), `taskID` (task ID)
- **Response**:
  ```json
  {
    "msg": "Task deleted successfully"
  }
  ```

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id       String    @id @db.VarChar(40)
  email    String    @unique @db.VarChar(50)
  password String
  project  Project[]
}
```

### Project Model

```prisma
model Project {
  id          Int       @id @default(autoincrement())
  createdAt   DateTime  @default(now())
  title       String    @db.VarChar(50)
  description String?
  status      Status    @default(todo)
  startDate   DateTime  @default(now())
  endDate     DateTime?
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  task        Task[]
}
```

### Task Model

```prisma
model Task {
  id         Int       @id @default(autoincrement())
  assignedTo String?   @db.VarChar(20)
  content    String
  status     Status    @default(todo)
  startDate  DateTime  @default(now())
  endDate    DateTime?
  projectId  Int
  project    Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

### Status Enum

```prisma
enum Status {
  inprogress
  todo
  completed
  overdue
}
```

## 🔧 Project Structure

```
backend/
├── auth/
│   ├── controllers/
│   │   ├── authcontroller.js      # User authentication logic
│   │   ├── projectcontroller.js   # Project management logic
│   │   └── taskcontroller.js      # Task management logic
│   ├── routes/
│   │   ├── userRoutes.js          # Authentication routes
│   │   ├── projectRoutes.js       # Project routes
│   │   └── taskRoutes.js          # Task routes
│   ├── utils/
│   │   ├── encrypt.js             # Password hashing utilities
│   │   ├── generatetoken.js       # JWT token utilities
│   │   └── prisma.js              # Database connection
│   └── server.js                  # Main server file
├── prisma/
│   ├── migrations/                # Database migrations
│   ├── modify.js                  # Database utilities
│   └── schema.prisma              # Database schema
├── package.json
└── README.md
```

## 🚀 Scripts

- `npm start` - Start the server
- `npm run prisma:seed` - Seed the database (if configured)

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
<!-- Email verification system removed -->
- Input validation and sanitization
- SQL injection protection through Prisma ORM
- CORS protection (configure as needed)

<!-- Email configuration section removed -->

## 🐛 Error Handling

The API includes comprehensive error handling for:

- Database connection issues
- Validation errors
- Authentication failures
- Resource not found errors
- Duplicate resource errors

## 📝 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**rishov** - Project Management API Backend

---

For more information or support, please refer to the project documentation or contact the development team.
