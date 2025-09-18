import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { addTransaction, updateTransaction, deleteTransaction, getCategories } from './api';

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

const TransactionManager = ({ transactions, setTransactions, auth }) => {
  // Scalable category lists
    // Categories from backend
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    React.useEffect(() => {
      async function fetchCategories() {
        try {
          const data = await getCategories();
          setIncomeCategories(data.income || []);
          setExpenseCategories(data.expense || []);
        } catch (err) {
          setIncomeCategories([]);
          setExpenseCategories([]);
        }
      }
      fetchCategories();
    }, []);
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

  const [selected, setSelected] = useState([]); // array of indexes
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const handleSelect = idx => {
    setSelected(selected.includes(idx)
      ? selected.filter(i => i !== idx)
      : [...selected, idx]);
  };

  const handleDelete = async () => {
    if (!auth?.user?.id || !auth?.token) {
      alert('User not authenticated.');
      return;
    }
    const toDelete = new Set(selected);
    // Optionally, call deleteTransaction API for each selected
    for (const idx of selected) {
      const txn = transactions[idx];
      if (txn && txn.id) {
        try {
          await deleteTransaction(auth.user.id, txn.id, auth.token);
        } catch (err) {
          // Optionally handle error per transaction
        }
      }
    }
    setTransactions(transactions.filter((_, idx) => !toDelete.has(idx)));
    setSelected([]);
  };

  const startEdit = idx => {
    setEditIdx(idx);
    setEditForm({ ...transactions[idx] });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async idx => {
    if (!auth?.user?.id || !auth?.token) {
      alert('User not authenticated.');
      return;
    }
    const txn = transactions[idx];
    const amt = parseFloat(editForm.amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Amount must be a positive number.');
      return;
    }
    if (!editForm.category) {
      alert('Please select a category.');
      return;
    }
    const updatedFields = { ...editForm, amount: amt.toFixed(2) };
    if (txn && txn.id) {
      try {
        await updateTransaction(auth.user.id, txn.id, updatedFields, auth.token);
      } catch (err) {
        alert('Failed to update transaction: ' + err.message);
        return;
      }
    }
    const updated = transactions.map((t, i) =>
      i === idx ? updatedFields : t
    );
    setTransactions(updated);
    setEditIdx(null);
  };

  const handleEditCancel = () => setEditIdx(null);
  
  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!auth?.user?.id || !auth?.token) {
      alert('User not authenticated.');
      return;
    }
    const file = fileInputRef.current.files[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result;
      const parsed = parseCSV(text);
    
      const validRows = parsed.filter(row => {
        if (!row.date || !row.description || !row.amount || !row.type || !row.category) return false;
        const amt = parseFloat(row.amount);
        const type = row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase();
        if (type !== 'Income' && type !== 'Expense') return false;
        if (isNaN(amt) || amt <= 0) return false;
        const allowedCats = type === 'Income' ? incomeCategories : expenseCategories;
        if (!allowedCats.includes(row.category)) return false;
        return true;
      });

      const formatted = validRows.map(row => ({
        date: row.date,
        description: row.description,
        amount: parseFloat(row.amount).toFixed(2),
        type: row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase(),
        category: row.category,
      }));

      let added = 0;
      for (const txn of formatted) {
        try {
          await addTransaction(auth.user.id, txn, auth.token);
          added++;
        } catch (err) {
          // Optionally handle error per row
        }
      }
      setTransactions([...transactions, ...formatted]);
      setUploadInfo({ count: added });
      setUploading(false);
      fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!auth?.user?.id || !auth?.token) {
        alert('User not authenticated.');
        return;
      }
      const amt = parseFloat(form.amount);
      if (isNaN(amt) || amt <= 0) {
        alert('Amount must be a positive number.');
        return;
      }
      if (!form.category) {
        alert('Please select a category.');
        return;
      }
      const newTxn = { ...form, amount: amt.toFixed(2) };
      const result = await addTransaction(auth.user.id, newTxn, auth.token);
      setTransactions([
        ...transactions,
        result.transaction || newTxn
      ]);
      setForm({ date: getToday(), description: '', amount: '', type: 'Expense', category: '' });
    } catch (err) {
      alert('Failed to add transaction: ' + err.message);
    }
  };

  return (
    <div className="transaction-manager-page container mt-4">
      <div className='d-flex flex-row justify-content-between align-items-center'>
        <h2 className="mb-4">Transaction Manager</h2>
        <Button className='btn-success' onClick={() => setShowModal(true)}>
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
            step="0.01"
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {(form.type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
        <>
          <div className="mb-2">
            <Button variant="danger" size="sm" disabled={selected.length === 0} onClick={handleDelete}>
              Delete Selected
            </Button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, idx) => {
                  // Find the real index in transactions array
                  const realIdx = transactions.findIndex(t => t === txn);
                  const isEditing = editIdx === realIdx;
                  return (
                    <tr key={realIdx}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(realIdx)}
                          onChange={() => handleSelect(realIdx)}
                        />
                      </td>
                      {isEditing ? (
                        <>
                          <td><input type="date" name="date" value={editForm.date} onChange={handleEditChange} className="form-control" /></td>
                          <td><input type="text" name="description" value={editForm.description} onChange={handleEditChange} className="form-control" /></td>
                          <td><input type="number" name="amount" value={editForm.amount} onChange={handleEditChange} className="form-control" /></td>
                          <td>
                            <select name="type" value={editForm.type} onChange={handleEditChange} className="form-select">
                              <option value="Income">Income</option>
                              <option value="Expense">Expense</option>
                            </select>
                          </td>
                          <td>
                            <select name="category" value={editForm.category} onChange={handleEditChange} className="form-select">
                              <option value="">Select Category</option>
                              {(editForm.type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{txn.date}</td>
                          <td>{txn.description}</td>
                          <td>${txn.amount}</td>
                          <td>{txn.type}</td>
                          <td>{txn.category}</td>
                        </>
                      )}
                      <td>
                        {isEditing ? (
                          <>
                            <Button size="sm" variant="success" onClick={() => handleEditSave(realIdx)} className="me-2">Save</Button>
                            <Button size="sm" variant="secondary" onClick={handleEditCancel}>Cancel</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="warning" onClick={() => startEdit(realIdx)}>Edit</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionManager;
