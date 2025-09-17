// Centralized API request functions for the DFA frontend
// Get backend base URL from environment variable
const BASE_URL = process.env.REACT_APP_BACKEND_URL;


export async function login(email, password) {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}


// Example: get all transactions
export async function fetchTransactions(userId, token) {
  const url = `${BASE_URL}/users/${userId}/transactions`;
  const response = await fetch(url, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Example: add a transaction
export async function addTransaction(transaction) {
  // return fetch('/api/transactions', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(transaction),
  // }).then(res => res.json());
  // Placeholder: implement with your backend endpoint
  return { success: true };
}

// Add more API functions as needed
