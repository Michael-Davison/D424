import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


function AnalyticsDashboard({ transactions }) {

  const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const pieOptions = {
    chart: { type: 'pie' },
    title: { text: 'Income vs Expense' },
    series: [{
      name: 'Total',
      colorByPoint: true,
      data: [
        { name: 'Income', y: income },
        { name: 'Expense', y: expense },
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
      <div className="mb-5">
        <HighchartsReact highcharts={Highcharts} options={pieOptions} />
      </div>
      <div className="mb-5">
        <HighchartsReact highcharts={Highcharts} options={trendOptions} />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
