import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import { Button } from "@/components/ui/Button";
import TaskList from "../components/Task/TaskList";


export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);



  const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
  if (!currentUserId) {
    toast.error("User not found. Please log in.");
    navigate("/login");
    return;
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      toast.error(res.data);
      setProject(res.data);
      setTasks(res.data.tasks);

      console.log(res.data);

    } catch {
      toast.error("Failed to load project.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success("Task deleted.");
      fetchProject();
    } catch {
      toast.error("Failed to delete task.");
    }
  };

  const handleToggleStatus = async (taskId, status) => {
    try {
      const newStatus = status === "pending" ? "completed" : "pending";
      await API.put(`/tasks/status/${taskId}`, { status: newStatus });
      toast.success(`Task marked ${newStatus}.`);
      fetchProject();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="p-6">
        {project ? (
          <>
            <h1 className="text-2xl font-bold mb-2">{project.name}</h1>

            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <Button
                onClick={() => navigate(`/projects/${project.id}/add-task`)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                + Add Task
              </Button>
            </div>
            {tasks.length === 0 ? (
              <p>No tasks yet.</p>
            ) : (

              // use task card component

              <div>


                <div class="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-2">
                  {tasks.map((task) => (

                    <div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl">

                      <div class="p-4 md:p-5">
                        <h3 class="text-lg font-bold text-gray-800">
                          {task.title}
                        </h3>
                        <p class="mt-1 text-gray-500">
                          {task.description}
                        </p>


                        <p class="mt-1 inline-flex mr-1 text-gray-500">
                          Assignee
                        </p>
                        <span

                          className="inline-flex items-center justify-center size-8 rounded-full bg-gray-700 text-xs font-semibold text-white"
                        >
                          {task?.assignee?.first_name.charAt(0).toUpperCase() + task?.assignee?.last_name.charAt(0).toUpperCase()}
                        </span>

                        <div class="mt-2 flex items-center ">
                          <span class="inline-flex items-center py-0.5 px-1 rounded-md text-xs font-medium bg-gray-200 ">
                            <p className="text-gray-900">{new Date(task.due_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}</p>



                          </span>
                          {task.status === "completed" ? (
                            <span className="inline-flex ml-1 items-center py-0.5 px-2 rounded-md text-xs font-medium bg-green-500 text-white">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex ml-1 items-center py-0.5 px-2 rounded-md text-xs font-medium bg-red-500 text-white">
                              Pending
                            </span>
                          )}

                        </div>


                        <div className="mt-4 grid auto-cols-max grid-flow-col space-y-1">


                          {currentUserId === task?.assignee?.id && (
                            <div className="flex gap-2">

                              <button type="button"
                                onClick={() => handleToggleStatus(task.id, task.status)}
                                class="py-1  px-2 inline-flex mr-2 items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:border-blue-500 hover:text-blue-500 focus:outline-hidden focus:border-blue-500 focus:text-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:border-blue-500 dark:text-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400">
                                {task.status === "pending" ? "Mark Done" : "Undo"}
                              </button>

                            </div>
                          )}



                          {(currentUserId === project.owner_id || currentUserId === task?.assignee?.id) && (
                            <div className="flex gap-2">
                              {/* {task?.assignee?.id}
                              {project.owner_id} */}

                              <button
                                onClick={() => navigate(`/projects/${project.id}/edit-task/${task.id}`)}
                                className="py-1 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-yellow-500 text-yellow-500 hover:border-yellow-400 focus:outline-hidden "
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                type="button"
                                className="py-1 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-red-500 text-red-500 hover:border-red-400 hover:text-red-400 "
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                  ))}

                </div>


              </div>
            )}


            < Button variant="outline" className="mt-6" onClick={() => navigate("/projects")}>
              Back to Projects
            </Button>
          </>
        ) : (
          <p>Loading project...</p>
        )
        }
      </div >
    </div>
  );
}





