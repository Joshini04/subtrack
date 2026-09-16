function SummaryCards({ totalMonthly, totalAnnual }) {
  return (
    <div className="summary-cards">
      <div className="summary-card">
        <h3>Total Monthly Spend</h3>
        <p className="summary-amount">${totalMonthly.toFixed(2)}</p>
      </div>
      <div className="summary-card">
        <h3>Total Annual Spend</h3>
        <p className="summary-amount">${totalAnnual.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default SummaryCards;