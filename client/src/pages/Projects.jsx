// /src/pages/Projects.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import { Button } from "@/components/ui/Button";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects"); // GET all projects
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project? This will remove all its tasks.")) return;
    try {
      await API.delete(`/projects/${projectId}`);
      toast.success("Project deleted.");
      fetchProjects();
    } catch (err) {
      toast.error("Failed to delete project.");
    }
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDescription(project.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleSaveEdit = async (projectId) => {
    try {
      await API.put(`/projects/${projectId}`, {
        name: editName,
        description: editDescription,
      });
      toast.success("Project updated.");
      fetchProjects();
      setEditingId(null);
    } catch (err) {
      toast.error("Failed to update project.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Projects</h1>

        {projects.length === 0 ? (
          <p>No projects found. You can create one in the dashboard or API.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id} className="border p-4 rounded shadow hover:shadow-md">
                {editingId === project.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border rounded px-2 py-1 mb-2"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="w-full border rounded px-2 py-1 mb-2"
                    />
                    <div className="space-x-2">
                      <Button size="sm" onClick={() => handleSaveEdit(project.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{project.name}</h2>
                    <p className="text-gray-600">{project.description}</p>
                    <div className="space-x-2 mt-2">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View Project →
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(project)}
                      >
                        Edit
                      </Button>
                      <Link
                        to={`/projects/collaborators/${project.id}`}
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(project)}
                      >
                        Add Collaborator
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

export default Projects;
