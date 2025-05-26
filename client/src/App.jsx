import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import NavBar from "./components/NavBar.jsx";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import CreateTask from "./pages/CreateTask";
import TaskComments from "./components/Task/TaskComments";
import ChatRoom from "./pages/ChatRoom";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import Test from "./pages/Test";
import Chat from "./pages/Chat";
import EditTask from "./pages/EditTask";
import AddCollaborator from "./pages/AddCollaborator";
function App() {
  const { token, user } = useAuth();

  const Protected = ({ children }) =>
    token ? children : <Navigate to="/login" replace />;

  return (
    <>
      <NavBar />

      <Routes>
        {/* 1. Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Home */}
        <Route path="/home" element={<Home />} />

        {/* 3. Features (public) */}
        <Route path="/features" element={<Features />} />

        {/* 4. Signup / Login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 5. Onboarding */}
        <Route
          path="/setup"
          element={
            <Protected>
              <Onboarding />
            </Protected>
          }
        />

        {/* 6. Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <Protected>
              <AdminDashboard />
            </Protected>
          }
        />

        {/* 7. Projects */}
        <Route
          path="/create-project"
          element={
            <Protected>
              <CreateProject />
            </Protected>
          }
        />
        <Route
          path="/projects"
          element={
            <Protected>
              <Projects />
            </Protected>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <Protected>
              <ProjectDetail />
            </Protected>
          }
        />


        <Route
          path="/test"
          element={
            <Protected>
              <Test />
            </Protected>
          }
        />
        <Route
          path="/projects/collaborators/:id"
          element={
            <Protected>
              <AddCollaborator />
            </Protected>
          }
        />


        <Route
          path="/projects/:id/add-task"
          element={
            <Protected>
              <CreateTask />
            </Protected>
          }
        />

        <Route
          path="/projects/:id/edit-task/:taskId"
          element={
            <Protected>
              <EditTask />
            </Protected>
          }
        />


        {/* 8. Task Comments */}
        <Route
          path="/task/:id/comments"
          element={
            <Protected>
              <TaskComments />
            </Protected>
          }
        />

        {/* 9. Chat */}

        <Route
          path="/chat"
          element={
            <Protected>
              <Chat />
            </Protected>
          }
        />
        <Route
          path="/chat/:projectId"
          element={
            <Protected>
              <ChatRoom />
            </Protected>
          }
        />

        {/* 10. Notifications */}
        <Route
          path="/notifications"
          element={
            <Protected>
              <Notifications />
            </Protected>
          }
        />

        {/* Catch-all: redirect unknown → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
