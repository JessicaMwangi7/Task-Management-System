// client/src/pages/ProjectsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ProjectsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Load projects
  useEffect(() => {
    API.get("/projects", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProjects(res.data))
      .catch(() => /* handle error or redirect to login */ navigate("/login"));
  }, [token]);

  // Create
  const handleCreate = async e => {
    e.preventDefault();
    const res = await API.post(
      "/projects",
      { name: newName, description: newDesc },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProjects([...projects, res.data]);
    setNewName("");
    setNewDesc("");
  };

  // Start editing
  const startEdit = p => {
    setEditId(p.id);
    setEditName(p.name);
    setEditDesc(p.description || "");
  };

  // Submit edit
  const handleEdit = async e => {
    e.preventDefault();
    const res = await API.put(
      `/projects/${editId}`,
      { name: editName, description: editDesc },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setProjects(projects.map(p => (p.id === editId ? res.data : p)));
    setEditId(null);
  };

  // Delete
  const handleDelete = async id => {
    if (!window.confirm("Delete this project?")) return;
    await API.delete(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Projects</h1>

      {/* Create form */}
      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Project name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <textarea
          placeholder="Description (optional)"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Project
        </button>
      </form>

      {/* Projects list */}
      <ul className="space-y-4">
        {projects.map(p => (
          <li
            key={p.id}
            className="p-4 border rounded flex justify-between items-start"
          >
            {editId === p.id ? (
              /* Edit form */
              <form onSubmit={handleEdit} className="flex-1 space-y-2">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  className="w-full px-2 py-1 border rounded"
                />
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
                <div className="space-x-2">
                  <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Read-only view */
              <>
                <div>
                  <h2 className="text-xl font-semibold">{p.name}</h2>
                  {p.description && <p className="text-gray-700">{p.description}</p>}
                  <p className="text-xs text-gray-500">
                    Created: {new Date(p.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-2 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
