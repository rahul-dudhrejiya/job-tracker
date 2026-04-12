# 🚀 Job Tracker — MERN Stack Application

A full-stack job application tracking system built with the MERN stack!

## 🌐 Live Demo
🔗 **[Click Here to View Live App](https://job-tracker-ten-mauve.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Secure JWT-based login & register |
| ➕ Job Management | Add, Edit, Delete job applications |
| 🔍 Search & Sort | Filter jobs by company, role, location |
| 📊 Analytics Dashboard | Pie chart & bar chart visualizations |
| 📅 Interview Date Tracker | Never miss an interview! |
| 📋 Status Timeline | Track your journey for each job |
| ⬇️ Export to CSV | Download all jobs as Excel file |
| 🌙 Dark Mode | Easy on the eyes! |

---

## 📸 Screenshots

### 📊 Analytics Dashboard
![Analytics](screenshots/analytics.png)

### 💼 Job Applications
![Dashboard](screenshots/dashboard.png)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | UI Framework |
| React Router | Page Navigation |
| Context API | Global State Management |
| Axios | API Calls |
| Recharts | Data Visualization |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password Hashing |

---

## 📁 Project Structure

    job-tracker/
    ├── backend/
    │   ├── config/
    │   │   └── db.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   └── jobController.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── models/
    │   │   ├── User.js
    │   │   └── Job.js
    │   ├── routes/
    │   │   ├── auth.js
    │   │   └── jobs.js
    │   └── server.js
    │
    └── frontend/
        └── src/
            ├── components/
            │   ├── Navbar.jsx
            │   ├── JobCard.jsx
            │   ├── AddJobModal.jsx
            │   ├── EditJobModal.jsx
            │   ├── Analytics.jsx
            │   ├── StatusTimeline.jsx
            │   └── Loader.jsx
            ├── context/
            │   └── AuthContext.jsx
            ├── pages/
            │   ├── Login.jsx
            │   ├── Register.jsx
            │   └── Dashboard.jsx
            └── utils/
                ├── api.js
                └── interviewHelper.js

---

## 🚀 Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### 1. Clone the repository

    git clone https://github.com/rahul-dudhrejiya/job-tracker.git
    cd job-tracker

### 2. Setup Backend

    cd backend
    npm install

Create `.env` file inside backend folder:

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRE=30d
    NODE_ENV=development

    npm run dev

### 3. Setup Frontend

    cd frontend
    npm install
    npm run dev

### 4. Open Browser

    Frontend → http://localhost:5173
    Backend  → http://localhost:5000

---

## 🔗 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Job Routes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/jobs | Get all jobs |
| POST | /api/jobs | Create new job |
| PUT | /api/jobs/:id | Update job |
| DELETE | /api/jobs/:id | Delete job |

---

## 👨‍💻 Developer

**Rahul Dudharejiya**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rahul-dudhrejiya)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rahul-dudhrejiya)

---

## 📄 License
MIT License © 2026 Rahul Dudharejiya
