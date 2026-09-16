import SubscriptionCard from './SubscriptionCard';

function SubscriptionGrid({ subscriptions, onDelete, onEdit }) {
  if (subscriptions.length === 0) {
    return <p className="empty-state">No subscriptions yet. Add your first one above.</p>;
  }

  return (
    <div className="subscription-grid">
      {subscriptions.map((sub) => (
        <SubscriptionCard key={sub.id} subscription={sub} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default SubscriptionGrid;