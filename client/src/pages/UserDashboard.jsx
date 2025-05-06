import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Input from '../components/Input';

const UserDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState({});
  const [refresh, setRefresh] = useState(false);

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/users`, headers);
        setUsers(res.data.users || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching users:', err.response?.data?.message || err.message);
      }
    };
    fetchUsers();
  }, [refresh]);

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users`, formData, headers);
      setFormData({ name: '', email: '', role: 'USER', password: '' });
      setRefresh(!refresh);
    } catch (err) {
      alert(err.response?.data?.message || 'User creation failed');
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, headers);
      setRefresh(!refresh);
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Update user role
  const handleRoleUpdate = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, { role: newRole }, headers);
      setEditingRole({});
      setRefresh(!refresh);
    } catch (err) {
      alert('Failed to update role');
    }
  };

  // Filtered and searched users
  const filteredUsers = users.filter((u) => {
    return (
      (!roleFilter || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div>
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>

        {/* Create User Form */}
        <form onSubmit={handleCreateUser} className="bg-white p-4 rounded shadow mb-6 space-y-4">
          <h3 className="text-lg font-semibold">Create New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="USER">USER</option>
                <option value="UNIT MANAGER">UNIT MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create User</button>
        </form>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="border p-2 rounded w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border p-2 rounded ml-2"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="UNIT MANAGER">Unit Manager</option>
            <option value="USER">User</option>
          </select>
        </div>

        {/* User Table */}
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="w-full border rounded bg-white shadow text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td className="p-2 border">{u.name}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">
                    {editingRole[u._id] ? (
                      <select
                        className="border p-1"
                        value={editingRole[u._id]}
                        onChange={(e) =>
                          setEditingRole({ ...editingRole, [u._id]: e.target.value })
                        }
                      >
                        <option value="USER">USER</option>
                        <option value="UNIT MANAGER">UNIT MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>
                  <td className="p-2 border space-x-2">
                    {editingRole[u._id] ? (
                      <button
                        onClick={() => handleRoleUpdate(u._id, editingRole[u._id])}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingRole({ ...editingRole, [u._id]: u.role })}
                        className="bg-yellow-400 px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
