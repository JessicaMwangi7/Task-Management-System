import { use, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";

export default function EditTask() {
  const { id, taskId } = useParams(); // project id
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();



  useEffect(() => {
    fetchUsers();
    fetchTask();
  }, [taskId]);


  const fetchUsers = async () => {
    try {
      const res = await API.get("/user/all");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users.");
    }
  };
  // fetch task for edit
  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${taskId}`);
      setTitle(res.data?.task?.title);
      setDescription(res.data?.task?.description);
      setDueDate(res.data?.task?.due_date);
      setUserId(res.data?.task?.assignee_id);
    } catch (error) {
      toast.error("Failed to load task.");
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tasks/${taskId}`, {
        title,
        description,
        due_date: dueDate,
        assignee_id: userId,
      });
      toast.success("Task Updated!");
      navigate(`/projects/${id}`);
    } catch {
      toast.error("Failed to create task.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold mb-4">Edit Task </h1>
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
            <label className="text-sm font-medium text-gray-700">Assign to</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
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
            Edit Task
          </Button>
        </form>
      </div>
    </div>
  );
}
