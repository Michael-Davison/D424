// Fetch categories for transactions
export async function getCategories() {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}
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

// Create a transaction
export async function addTransaction(userId, transaction, token) {
  const url = `${BASE_URL}/users/${userId}/transactions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(transaction)
  });
  if (!response.ok) {
    throw new Error('Failed to add transaction');
  }
  return response.json();
}

// Edit (update) a transaction
export async function updateTransaction(userId, transactionId, updatedFields, token) {
  const url = `${BASE_URL}/users/${userId}/transactions/${transactionId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(updatedFields)
  });
  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }
  return response.json();
}

// Delete a transaction
export async function deleteTransaction(userId, transactionId, token) {
  const url = `${BASE_URL}/users/${userId}/transactions/${transactionId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }
  return response.json();
}
