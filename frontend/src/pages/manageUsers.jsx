import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch("http://localhost:5000/user/")
      .then((res) => res.json())
      .then((json) => {
        const data = json.data || json;
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlock = (userId, isBlocked) => {
    fetch(`http://localhost:5000/user/${isBlocked ? "unblock" : "block"}/${userId}`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then(() => {
        toast.success(`User ${isBlocked ? "unblocked" : "blocked"} successfully`);
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error toggling user status:", err);
        toast.error("Failed to update user status");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded shadow p-4">
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2">
                    {user.isBlocked ? (
                      <span className="text-red-600 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleBlock(user._id, user.isBlocked)}
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
