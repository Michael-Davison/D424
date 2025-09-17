
import TransactionManager from './TransactionManager.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchTransactions } from './api';


function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      <h1>Davison Financial Analytics</h1>
        <div className="d-flex gap-3 mt-5">
        <Link to="/transaction-manager">
          <button className="btn btn-primary btn-lg">Transaction Manager</button>
        </Link>
        <Link to="/analytics-dashboard">
          <button className="btn btn-success btn-lg">Analytics Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Replace with actual userId logic as needed
    const userId = '1';
    fetchTransactions(userId)
      .then(data => setTransactions(data))
      .catch(err => console.error('Failed to fetch transactions:', err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transaction-manager" element={<TransactionManager transactions={transactions} setTransactions={setTransactions} />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard transactions={transactions} />} />
      </Routes>
    </Router>
  );
}

export default App;
