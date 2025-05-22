import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CreateProject() {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const navigate                      = useNavigate();
  const { token }                     = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name.trim()) {
      toast.error("Please enter a project name.");
      return;
    }

    try {
      // NOTE: we no longer pass a headers override here —
      //       our axios instance already injects the Bearer token.
      await API.post("/projects", {
        name: name.trim(),
        description: description.trim(),
      });

      toast.success("Project created!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create project:", err);

      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to create project. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Create a New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
