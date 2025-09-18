
import TransactionManager from './TransactionManager.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import Login from './Login.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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

  // Navbar component
  function Navbar() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">DFA</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' text-white fw-bold' : '')} to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' text-white fw-bold' : '')} to="/transaction-manager">Transaction Manager</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' text-white fw-bold' : '')} to="/analytics-dashboard">Analytics Dashboard</NavLink>
              </li>
            </ul>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home onLogout={handleLogout} />} />
        <Route path="/transaction-manager" element={<TransactionManager transactions={transactions} setTransactions={setTransactions} auth={auth} />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard transactions={transactions} auth={auth} />} />
      </Routes>
    </Router>
  );
}

export default App;
