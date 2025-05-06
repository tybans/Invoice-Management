import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useInvoice } from '../context/InvoiceContext';
import Input from './Input';

const InvoiceDashboard = () => {
  const { token } = useInvoice();

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [fyFilter, setFyFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    invoiceAmount: '',
  });

  const [editInvoiceId, setEditInvoiceId] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('/api/invoices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data.invoices);
      setFilteredInvoices(res.data.invoices);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearch = () => {
    let filtered = invoices;

    if (search) {
      filtered = filtered.filter(inv =>
        inv.invoiceNumber.toString().includes(search)
      );
    }

    if (fyFilter) {
      filtered = filtered.filter(inv =>
        inv.financialYear === fyFilter
      );
    }

    if (dateRange.from && dateRange.to) {
      const from = new Date(dateRange.from);
      const to = new Date(dateRange.to);
      filtered = filtered.filter(inv => {
        const date = new Date(inv.invoiceDate);
        return date >= from && date <= to;
      });
    }

    setFilteredInvoices(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [search, fyFilter, dateRange]);

  const handleChange = (e) => {
    setNewInvoice({ ...newInvoice, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/invoices', newInvoice, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewInvoice({ invoiceNumber: '', invoiceDate: '', invoiceAmount: '' });
      fetchInvoices();
    } catch (err) {
      console.error('Error creating invoice:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/invoices/${editInvoiceId}`, newInvoice, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditInvoiceId(null);
      setNewInvoice({ invoiceNumber: '', invoiceDate: '', invoiceAmount: '' });
      fetchInvoices();
    } catch (err) {
      console.error('Error updating invoice:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInvoices();
    } catch (err) {
      console.error('Error deleting invoice:', err);
    }
  };

  const startEdit = (inv) => {
    setEditInvoiceId(inv._id);
    setNewInvoice({
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate.slice(0, 10),
      invoiceAmount: inv.invoiceAmount,
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Invoice Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Input label="Search by Number" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Input label="Filter by FY" value={fyFilter} onChange={(e) => setFyFilter(e.target.value)} />
        <Input label="From Date" type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} />
        <Input label="To Date" type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input label="Invoice Number" name="invoiceNumber" value={newInvoice.invoiceNumber} onChange={handleChange} />
        <Input label="Invoice Date" name="invoiceDate" type="date" value={newInvoice.invoiceDate} onChange={handleChange} />
        <Input label="Invoice Amount" name="invoiceAmount" value={newInvoice.invoiceAmount} onChange={handleChange} />
      </div>

      <div className="mb-4">
        {editInvoiceId ? (
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Update Invoice</button>
        ) : (
          <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Create Invoice</button>
        )}
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Number</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((inv) => (
            <tr key={inv._id} className="text-center">
              <td className="border px-2 py-1">{inv.invoiceNumber}</td>
              <td className="border px-2 py-1">{inv.invoiceDate.slice(0, 10)}</td>
              <td className="border px-2 py-1">{inv.invoiceAmount}</td>
              <td className="border px-2 py-1 space-x-2">
                <button onClick={() => startEdit(inv)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(inv._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
          {filteredInvoices.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">No invoices found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceDashboard;
