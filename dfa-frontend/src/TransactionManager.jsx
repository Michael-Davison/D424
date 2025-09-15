import React, { useState } from 'react';

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const TransactionManager = () => {
  const [form, setForm] = useState({
    date: getToday(),
    description: '',
    amount: '',
    type: 'Income',
  });
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTransactions([
      ...transactions,
      { ...form, amount: parseFloat(form.amount).toFixed(2) },
    ]);
    setForm({ date: getToday(), description: '', amount: '', type: 'Income' });
  };

  return (
    <div className="transaction-manager-page container mt-4">
      <h2 className="mb-4">Transaction Manager</h2>
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
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
          <button type="submit" className="btn btn-primary w-100">
            Add Transaction
          </button>
        </div>
      </form>

      {transactions.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx}>
                  <td>{txn.date}</td>
                  <td>{txn.description}</td>
                  <td>${txn.amount}</td>
                  <td>{txn.type}</td>
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
