function SubscriptionCard({ subscription, onDelete, onEdit }) {
  const { id, name, cost, billing_cycle, next_renewal_date, color } = subscription;

  const renewalDate = new Date(next_renewal_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return (
<div className="subscription-card" style={{ '--dot-color': color }}>      <div className="subscription-card-header">
        <h4>{name}</h4>
        <span className="billing-cycle-tag">{billing_cycle}</span>
      </div>
      <p className="subscription-cost">${parseFloat(cost).toFixed(2)}</p>
      <p className="subscription-renewal">Renews {renewalDate}</p>
      <div className="subscription-actions">
        <button onClick={() => onEdit(subscription)}>Edit</button>
        <button onClick={() => onDelete(id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
}

export default SubscriptionCard;