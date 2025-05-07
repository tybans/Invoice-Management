import React, { useEffect, useState } from "react";
import { BASE_URL, FY_OPTIONS } from "../utils/constant";
import { fetchWithAuth } from "../utils/utils";

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [filterFY, setFilterFY] = useState("");
  const [form, setForm] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    invoiceAmount: "",
    financialYear: "",
  });
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
        inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterFY) {
      filtered = filtered.filter((inv) => inv.financialYear === filterFY);
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
    const { invoiceNumber, invoiceDate, invoiceAmount, financialYear } = form;
    if (!invoiceNumber || !invoiceDate || !invoiceAmount || !financialYear) return;

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

      setForm({
        invoiceNumber: "",
        invoiceDate: "",
        invoiceAmount: "",
        financialYear: "",
      });
      setEditingId(null);
      fetchInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (invoice) => {
    setForm({
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate.slice(0, 10),
      invoiceAmount: invoice.invoiceAmount,
      financialYear: invoice.financialYear,
    });
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
          placeholder="Search by Invoice Number"
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <input
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={handleChange}
            placeholder="Invoice Number"
            className="border p-2 rounded"
          />
          <input
            name="invoiceDate"
            type="date"
            value={form.invoiceDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="invoiceAmount"
            type="number"
            value={form.invoiceAmount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
          />
          <select
            name="financialYear"
            value={form.financialYear}
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
        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Invoice" : "Add Invoice"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  invoiceNumber: "",
                  invoiceDate: "",
                  invoiceAmount: "",
                  financialYear: "",
                });
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Invoice No</th>
              <th className="p-3">Date</th>
              <th className="p-3">Amount</th>
              <th className="p-3">FY</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv._id} className="border-b">
                <td className="p-3">{inv.invoiceNumber}</td>
                <td className="p-3">{inv.invoiceDate?.slice(0, 10)}</td>
                <td className="p-3">{inv.invoiceAmount}</td>
                <td className="p-3">{inv.financialYear}</td>
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
                <td colSpan="5" className="text-center py-4">
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
