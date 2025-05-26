💼 **TaskFlow: Collaborative Task Management Application**

A modern, minimalist platform built with **Flask (Python)** and **React + Tailwind CSS**, designed to help teams manage projects, tasks, real-time chat, and automated notifications—all in one place.

> 🔗 Live Repo: [https://github.com/JessicaMwangi7/TaskFlow](https://github.com/JessicaMwangi7/TaskFlow)

---

## Tech Stack

| Frontend                    | Backend                            | Database | Auth                  | Real-Time                  |
| --------------------------- | ---------------------------------- | -------- | --------------------- | -------------------------- |
| React + Vite + Tailwind CSS | Flask + Flask-RESTful + SQLAlchemy | SQLite   | JWT (JSON Web Tokens) | Firebase Realtime Database |

---

## Key Features

✅ **User Authentication (JWT)**

* Secure signup, login, token refresh
* Protected API routes for all private data

✅ **Project & Team Management**

* Create, update, delete projects & teams
* Assign collaborators (many-to-many relationship)

✅ **Task Management**

* Full CRUD: create, read, update, delete tasks
* Assign tasks to team members, set status & due dates

✅ **Real-Time Chat & Updates**

* In-app team chat via Firebase Realtime Database
* Instant message sync across clients

✅ **Notifications & Accountability**

* Automated alerts for upcoming deadlines
* Track who’s doing what & when via timestamps

---

## 📁 Project Structure

```
taskflow/
├── server/          # Flask Backend
│   ├── config.py
│   ├── extensions.py
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── scripts/seed.py
│   └── requirements.txt
└── client/          # React + Vite + Tailwind Frontend
    ├── public/
    ├── src/
    │   ├── api.js
    │   ├── contexts/AuthContext.jsx
    │   ├── components/
    │   ├── pages/
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🛠️ Local Setup Instructions

### ✅ Backend (Flask API)

1. **Navigate to the backend folder**

   ```bash
   cd server
   ```
2. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```
3. **Configure environment**

   ```bash
   cp .env.example .env
   ```
4. **Initialize database & seed data**

   ```bash
   flask db upgrade
   python scripts/seed.py
   ```
5. **Run the Flask server**

   ```bash
   flask run
   # accessible at http://localhost:5000
   ```

### ✅ Frontend (React App)

1. **Navigate to the client folder**

   ```bash
   cd client
   ```
2. **Install Node dependencies**

   ```bash
   npm install
   ```
3. **Configure environment**

   ```bash
   cp .env.example .env
   ```
4. **Start the development server**

   ```bash
   npm run dev
   # accessible at http://localhost:5173
   ```

---

## 🌟 Future Enhancements

* **Email/SMS Notifications** for critical updates
* **AI-Powered Task Prioritization** and suggestions
* **Calendar** with drag-and-drop tasks
* **OAuth Login** (Google, Microsoft)
* **Mobile App** via React Native

---

👨‍💻 **Developer**
Jessica Mwangi
Aspiring Software Engineer | Business & IT
📍 Nairobi, Kenya
🔗 GitHub: @JessicaMwangi7
🔗 LinkedIn: linkedin.com/in/jessicabwangi

📜 **License**
This project is licensed under the MIT License.
