// src/pages/Dashboard.jsx
import React, { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";


export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [collaborators, setCollaborators] = useState();



  useEffect(() => {
    fetchProjects();
  }, []);


  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);





      console.log(res.data?.collaborators); // Debugging line to check collaborators
    } catch (error) {
      toast.error("Failed to load projects.");
    }
  }


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
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
          <p className="text-gray-600">You haven't created any projects yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(proj => {
              const completed = proj.tasks.filter(t => t.status === "completed").length;
              const total = proj.tasks.length;
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

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

                  <button type="button" class="py-1 px-1 mt-1 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-gray-200 text-gray-800 shadow-2xs">
                    Tasks
                    <span class="inline-flex items-center py-0.5 px-1 rounded-full text-xs font-medium bg-gray-500 text-white">{total}</span>
                  </button>

                  <h6 className="mt-1 text-gray-600 "><small>Collaborators</small></h6>

                  <div className="flex -space-x-3">
                    {proj?.collaborators?.map((collab, index) => {
                      if (index > 5) return null; // Limit to 3 collaborators
                      return (
                        <span
                          key={collab.user_id}
                          className="inline-flex items-center justify-center size-8 rounded-full bg-green-500 text-xs font-semibold text-white"
                        >
                          {collab.user.first_name.charAt(0).toUpperCase() + collab.user.last_name.charAt(0).toUpperCase()}
                        </span>
                      );
                    })}


                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
