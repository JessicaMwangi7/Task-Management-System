// /src/pages/Team.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import { Button } from "@/components/ui/Button";

function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await API.get("/collaborators"); // ✅ adjust endpoint if needed
      setTeamMembers(res.data);
    } catch (err) {
      toast.error("Failed to load team members.");
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    try {
      await API.post("/collaborators", { email, role });
      toast.success("Collaborator added!");
      setEmail("");
      setRole("member");
      fetchTeam(); // ✅ refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add collaborator.");
    }
  };

  const handleDeleteCollaborator = async (id) => {
    if (!window.confirm("Remove this collaborator?")) return;
    try {
      await API.delete(`/collaborators/${id}`);
      toast.success("Collaborator removed.");
      fetchTeam();
    } catch (err) {
      toast.error("Failed to remove collaborator.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-primary">Your Team</h1>
        <p className="text-gray-600 mb-6">
          Manage your team members, invite collaborators, and assign roles.
        </p>

        {/* ✅ Invite Collaborator Form */}
        <form
          onSubmit={handleAddCollaborator}
          className="bg-white shadow rounded p-4 mb-6 space-y-3"
        >
          <h2 className="text-lg font-semibold mb-2">Invite New Collaborator</h2>
          <input
            type="email"
            placeholder="User email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Add Collaborator
          </Button>
        </form>

        {/* ✅ Team Members Table */}
        {teamMembers.length === 0 ? (
          <p className="text-gray-600">No team members yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-t">
                    <td className="py-2 px-4">{member.name}</td>
                    <td className="py-2 px-4">{member.email}</td>
                    <td className="py-2 px-4 capitalize">{member.role}</td>
                    <td className="py-2 px-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCollaborator(member.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;
