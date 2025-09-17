
import TransactionManager from './TransactionManager.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import Login from './Login.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { fetchTransactions } from './api';


function Home({ onLogout }) {
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
      <button
        className="btn btn-outline-danger btn-lg"
        style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [auth, setAuth] = useState(() => {
    // Try to load auth from localStorage (persist login)
    const saved = localStorage.getItem('dfa_auth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (auth && auth.user && auth.token) {
      fetchTransactions(auth.user.id, auth.token)
        .then(data => setTransactions(data))
        .catch(err => console.error('Failed to fetch transactions:', err));
    }
  }, [auth]);

  const handleLogin = (authData) => {
    setAuth(authData);
 
  };

  // Logout handler
  const handleLogout = () => {
    setAuth(null);
    setTransactions([]);

  };

  // If not logged in, show login page only
  if (!auth) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onLogout={handleLogout} />} />
        <Route path="/transaction-manager" element={<TransactionManager transactions={transactions} setTransactions={setTransactions} auth={auth} />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard transactions={transactions} auth={auth} />} />
      </Routes>
    </Router>
  );
}

export default App;
