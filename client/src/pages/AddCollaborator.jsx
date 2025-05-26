import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import { Button } from "@/components/ui/Button";


export default function AddCollaborator() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");



    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
    if (!currentUserId) {
        toast.error("User not found. Please log in.");
        navigate("/login");
        return;
    }

    useEffect(() => {
        fetchProject();
        fetchUsers();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await API.get(`/projects/${id}`);

            setProject(res.data);

            console.log(res.data);

        } catch {
            toast.error("Failed to load project.");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await API.get("/user/all");
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to load users.");
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/collaborators`, {
                user_id: userId
                , project_id: id
            });
            toast.success("Collaborator added!");
            setUserId(""); // Reset the userId after adding

        } catch (error) {
            toast.error("Failed to add collaborator.");
        }
    }








    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="p-6">
                {project ? (
                    <>
                        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>

                        <p className="text-gray-600 mb-4">{project.description}</p>

                        {/* collabo form  */}

                        <form onSubmit={handleSubmit} className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Add Collaborator
                            </label>
                            <div>

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
                            <Button variant="primary" className="w-full">
                                Add Collaborator
                            </Button>
                        </form>




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





