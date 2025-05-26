import React, { useState } from "react";
import api from "../../api/axios";

export default function TaskForm({ projectId, members, onAdd }) {
  const [form, setForm] = useState({ title: "", description: "", assignee_id: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post(`/projects/${projectId}/tasks`, {
      title: form.title,
      description: form.description,
      assignee_id: form.assignee_id || null,
    });
    setForm({ title: "", description: "", assignee_id: "" });
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <select
        name="assignee_id"
        value={form.assignee_id}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Unassigned</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.first_name} {m.last_name}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Task
      </button>
    </form>
  );
}
