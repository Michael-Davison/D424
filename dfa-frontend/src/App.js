
import TransactionManager from './TransactionManager.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, Route, BrowserRouter as Router, Routes} from 'react-router-dom';


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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transaction-manager" element={<TransactionManager />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
