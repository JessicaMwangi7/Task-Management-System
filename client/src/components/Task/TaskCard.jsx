import React from "react";

export default function TaskCard({
  task,
  onToggleStatus,
  onDelete,
  onViewComments,
}) {
  return (
    <div className="border p-4 rounded shadow-sm flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold">{task.title}</h3>
        {task.description && <p className="text-gray-600">{task.description}</p>}
        <p className="mt-2 text-sm">
          <strong>Status:</strong> {task.status}
        </p>
        {task.due_date && (
          <p className="text-sm">
            <strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}
          </p>
        )}
        {task.assignee_name && (
          <p className="text-sm">
            <strong>Assignee:</strong> {task.assignee_name}
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => onToggleStatus(task)}
          className="bg-yellow-500 text-white px-2 py-1 rounded"
        >
          {task.status === "pending" ? "Complete" : "Reopen"}
        </button>
        <button
          onClick={() => onViewComments(task)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Comments
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
