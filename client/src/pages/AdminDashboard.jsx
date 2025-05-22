// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users,    setUsers]    = useState([]);
  const [projects,setProjects] = useState([]);

  // fetch all users
  useEffect(() => {
    api.get("/admin/users").then(res => setUsers(res.data));
  }, []);

  // fetch admin-owned projects
  useEffect(() => {
    api.get("/projects/all")
       .then(res => setProjects(res.data))
       .catch(() => {/* optionally toast.error */});
  }, []);

  const deleteUser = id => {
    api.delete(`/admin/users/${id}`)
       .then(() => setUsers(u => u.filter(x => x.id !== id)));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* quick links */}
      <div className="flex gap-4">
        <Link to="/admin/users" className="btn">User Management</Link>
        <Link to="/projects"     className="btn">All Projects</Link>
        <Link to="/create-project" className="btn">+ New Project</Link>
        <Link to="/notifications" className="btn">Notifications</Link>
      </div>

      {/* user list */}
      <section>
        <h2 className="text-2xl font-semibold">Users</h2>
        <ul className="space-y-2">
          {users.map(u => (
            <li key={u.id} className="flex justify-between">
              <span>{u.first_name} {u.last_name} ({u.email}) — {u.role}</span>
              <button
                onClick={() => deleteUser(u.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* projects list */}
      <section>
        <h2 className="text-2xl font-semibold">Your Projects</h2>
        {projects.length ? (
          <ul className="space-y-4">
            {projects.map(p => (
              <li key={p.id} className="border p-4 rounded hover:shadow">
                <Link to={`/projects/${p.id}`}>
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  {p.description && <p className="text-gray-600">{p.description}</p>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven’t created any projects yet.</p>
        )}
      </section>
    </div>
  );
}
