import React, { useEffect, useState } from "react";
import { BASE_URL, FY_OPTIONS } from "../utils/constant";
import { fetchWithAuth } from "../utils/utils";

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [filterFY, setFilterFY] = useState("");
  const [form, setForm] = useState({ client: "", amount: "", fy: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await fetchWithAuth(`${BASE_URL}/invoices`);
      const data = await res.json();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearchFilter = () => {
    let filtered = [...invoices];
    if (search) {
      filtered = filtered.filter((inv) =>
        inv.client.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterFY) {
      filtered = filtered.filter((inv) => inv.fy === filterFY);
    }
    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    handleSearchFilter();
  }, [search, filterFY, invoices]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.client || !form.amount || !form.fy) return;

    const url = editingId
      ? `${BASE_URL}/invoices/${editingId}`
      : `${BASE_URL}/invoices`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save invoice");

      setForm({ client: "", amount: "", fy: "" });
      setEditingId(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (invoice) => {
    setForm({ client: invoice.client, amount: invoice.amount, fy: invoice.fy });
    setEditingId(invoice._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetchWithAuth(`${BASE_URL}/invoices/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice Dashboard</h2>

      {/* Filter Section */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by client"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={filterFY}
          onChange={(e) => setFilterFY(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All FY</option>
          {FY_OPTIONS.map((fy) => (
            <option key={fy} value={fy}>
              {fy}
            </option>
          ))}
        </select>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="client"
            value={form.client}
            onChange={handleChange}
            placeholder="Client name"
            className="border p-2 rounded"
          />
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
          />
          <select
            name="fy"
            value={form.fy}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select FY</option>
            {FY_OPTIONS.map((fy) => (
              <option key={fy} value={fy}>
                {fy}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Invoice" : "Add Invoice"}
        </button>
      </form>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Client</th>
              <th className="p-3">Amount</th>
              <th className="p-3">FY</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv._id} className="border-b">
                <td className="p-3">{inv.client}</td>
                <td className="p-3">{inv.amount}</td>
                <td className="p-3">{inv.fy}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(inv)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inv._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
