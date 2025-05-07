import React, { useEffect, useState } from "react";
import { BASE_URL, USER_ROLES } from "../utils/constant";
import { fetchWithAuth } from "../utils/utils";
import { useInvoiceContext } from "../context/InvoiceContext";

const UserDashboard = () => {
  const { token, logout } = useInvoiceContext();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const fetchUsers = async () => {
    try {
      const res = await fetchWithAuth(`${BASE_URL}/users`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Invalid data format: expected an array", data);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleSearchFilter = () => {
    let filtered = [...users];
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterRole) {
      filtered = filtered.filter((u) => u.role === filterRole);
    }
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearchFilter();
  }, [search, filterRole, users]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) return;

    try {
      const res = await fetchWithAuth(`${BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("User creation failed");
      setForm({ name: "", email: "", password: "", role: "USER" });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetchWithAuth(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetchWithAuth(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Role update failed");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>

      {/* Filter/Search */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Roles</option>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Create User Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border p-2 rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredUsers) && filteredUsers.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    {USER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
