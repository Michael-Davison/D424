import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchTransactions } from './api';

function AnalyticsDashboard({ auth }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (auth && auth.user && auth.token) {
      fetchTransactions(auth.user.id, auth.token)
        .then(data => setTransactions(data))
        .catch(err => console.error('Failed to fetch transactions:', err));
    }
  }, [auth]);

  // Only include expenses by category
  console.log(transactions)
  const expenseCategoryTotals = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = 0;
    acc[t.category] += parseFloat(t.amount);
    return acc;
  }, {});
  const categoryPieOptions = {
    chart: { type: 'pie' },
    title: { text: 'Expenses by Category' },
    tooltip: {
      pointFormat: '<b>$' + '{point.y:.2f}</b>'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: $' + '{point.y:.2f}'
        }
      }
    },
    series: [{
      name: 'Total',
      colorByPoint: true,
      data: Object.entries(expenseCategoryTotals).map(([name, y]) => ({ name, y }))
    }]
  };

  console.log(expenseCategoryTotals);

  const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const pieOptions = {
    chart: { type: 'pie' },
    title: { text: 'Income vs Expense' },
    tooltip: {
      pointFormat: '<b>$' + '{point.y:.2f}</b>'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '{point.name}: $' + '{point.y:.2f}'
        }
      }
    },
    series: [{
      name: 'Total',
      colorByPoint: true,
      data: [
        { name: 'Income', y: income },
        { name: 'Expense', y: Math.abs(expense) },
      ]
    }]
  };

  const dates = [...new Set(transactions.map(t => t.date))].sort();
  const incomeByDate = dates.map(date => transactions.filter(t => t.date === date && t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0));
  const expenseByDate = dates.map(date => transactions.filter(t => t.date === date && t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0));
  const trendOptions = {
    chart: { type: 'line' },
    title: { text: 'Transaction Trend' },
    xAxis: { categories: dates, title: { text: 'Date' } },
    yAxis: { title: { text: 'Amount ($)' } },
    series: [
      { name: 'Income', data: incomeByDate },
      { name: 'Expense', data: expenseByDate }
    ]
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="analytics-dashboard-page container mt-4">
        <h2 className="mb-4">Analytics Dashboard</h2>
        <div className="alert alert-info">No transactions available. Please add or upload transactions to see analytics.</div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard-page container mt-4">
      <h2 className="mb-4">Analytics Dashboard</h2>
      <div className="d-flex flex-row gap-4 mb-5" style={{ justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <HighchartsReact highcharts={Highcharts} options={pieOptions} />
        </div>
        <div style={{ flex: 1 }}>
          <HighchartsReact highcharts={Highcharts} options={categoryPieOptions} />
        </div>
      </div>
      <div className="mb-5">
        <HighchartsReact highcharts={Highcharts} options={trendOptions} />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
