import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ? values[i].trim() : '';
    });
    return obj;
  });
}

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const TransactionManager = ({ transactions, setTransactions }) => {
  const [form, setForm] = useState({
    date: getToday(),
    description: '',
    amount: '',
    type: 'Income',
    category: '',
  });
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(null);

  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter(txn => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      txn.date.toLowerCase().includes(s) ||
      txn.description.toLowerCase().includes(s) ||
      txn.amount.toString().toLowerCase().includes(s) ||
      txn.type.toLowerCase().includes(s) ||
      (txn.category || '').toLowerCase().includes(s)
    );
  });
  const handleCSVUpload = (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsed = parseCSV(text);

      const validRows = parsed.filter(row => row.date && row.description && row.amount && row.type && row.category);
      const formatted = validRows.map(row => ({
        date: row.date,
        description: row.description,
        amount: parseFloat(row.amount).toFixed(2),
        type: row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase(),
        category: row.category,
      }));
      setTransactions([...transactions, ...formatted]);
      setUploadInfo({ count: formatted.length });
      setUploading(false);
      fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTransactions([
      ...transactions,
      { ...form, amount: parseFloat(form.amount).toFixed(2) },
    ]);
    setForm({ date: getToday(), description: '', amount: '', type: 'Income', category: '' });
  };

  return (
    <div className="transaction-manager-page container mt-4">
      <div className='d-flex flex-row justify-content-between align-items-center'>
        <h2 className="mb-4">Transaction Manager</h2>
        <Button variant="info" onClick={() => setShowModal(true)}>
          Upload
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Transactions CSV</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleCSVUpload}>
          <Modal.Body>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept=".csv"
                ref={fileInputRef}
                required
                disabled={uploading}
              />
              <div className="form-text mt-2">
                CSV columns required: <b>date, description, amount, type, category</b>
              </div>
              {uploadInfo && (
                <div className="alert alert-success mt-3">
                  {uploadInfo.count} transactions uploaded successfully.
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={uploading}>
              Close
            </Button>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            Add Transaction
          </button>
        </div>
      </form>

      {filteredTransactions.length === 0 ? (
        <div className="alert alert-info">No transactions match your search.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, idx) => (
                <tr key={idx}>
                  <td>{txn.date}</td>
                  <td>{txn.description}</td>
                  <td>${txn.amount}</td>
                  <td>{txn.type}</td>
                  <td>{txn.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionManager;
