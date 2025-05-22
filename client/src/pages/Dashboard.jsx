// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user }        = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data))
      .catch(() => toast.error("Unable to load your projects."));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">
        {user.role === "admin" ? "Admin Dashboard" : `Welcome, ${user.first_name}`}
      </h1>

      {/* Quick Links Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {user.role === "admin" && (
          <Link to="/admin/users" className="card">
            User Management
          </Link>
        )}
        <Link to="/projects" className="card">
          All Projects
        </Link>
        <Link to="/create-project" className="card">
          + New Project
        </Link>
        <Link to="/notifications" className="card">
          Notifications
        </Link>
      </div>

      {/* Your Projects with Progress Bars */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-600">You haven’t created any projects yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(proj => {
              const completed = proj.tasks.filter(t => t.status === "completed").length;
              const total     = proj.tasks.length;
              const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.id}`}
                  className="block border rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-xl mb-2">{proj.name}</h3>
                  {proj.description && (
                    <p className="text-gray-600 mb-4">{proj.description}</p>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-width"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-sm mt-2">{pct}% complete</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
