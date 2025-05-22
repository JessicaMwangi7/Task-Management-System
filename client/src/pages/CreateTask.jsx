import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";

export default function CreateTask() {
  const { id } = useParams(); // project id
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate]       = useState("");
  const navigate                      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/tasks`, {
        title,
        description,
        due_date: dueDate,
      });
      toast.success("Task created!");
      navigate(`/projects/${id}`);
    } catch {
      toast.error("Failed to create task.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold mb-4">Add Task to Project</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">
            Create Task
          </Button>
        </form>
      </div>
    </div>
  );
}
