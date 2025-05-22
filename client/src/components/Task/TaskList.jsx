import React from "react";
import TaskCard from "./TaskCard";
import api from "../../api/axios";

export default function TaskList({ projectId, tasks, onUpdate, onViewComments }) {
  const toggleStatus = async (task) => {
    await api.put(`/projects/${projectId}/tasks/${task.id}`, {
      status: task.status === "pending" ? "completed" : "pending",
    });
    onUpdate();
  };

  const deleteTask = async (id) => {
    await api.delete(`/projects/${projectId}/tasks/${id}`);
    onUpdate();
  };

  return (
    <div className="space-y-4">
      {tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          onToggleStatus={toggleStatus}
          onDelete={deleteTask}
          onViewComments={() => onViewComments(t)}
        />
      ))}
    </div>
  );
}
