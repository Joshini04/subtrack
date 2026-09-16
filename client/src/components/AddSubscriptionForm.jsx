import { useState, useEffect } from 'react';

const DEFAULT_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

function AddSubscriptionForm({ onSubmit, editingSubscription, onCancelEdit }) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [renewalDate, setRenewalDate] = useState('');
  const [color, setColor] = useState(DEFAULT_COLORS[0]);

  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setCost(editingSubscription.cost);
      setBillingCycle(editingSubscription.billing_cycle);
      setRenewalDate(editingSubscription.next_renewal_date.split('T')[0]);
      setColor(editingSubscription.color);
    }
  }, [editingSubscription]);

  function resetForm() {
    setName('');
    setCost('');
    setBillingCycle('monthly');
    setRenewalDate('');
    setColor(DEFAULT_COLORS[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !cost || !renewalDate) return;

    onSubmit({
      name,
      cost: parseFloat(cost),
      billing_cycle: billingCycle,
      next_renewal_date: renewalDate,
      color,
    });

    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} className="add-subscription-form">
      <h3>{editingSubscription ? 'Edit Subscription' : 'Add a Subscription'}</h3>

      <div className="form-row">
        <input
          type="text"
          placeholder="Name (e.g. Netflix)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
        <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input
          type="date"
          value={renewalDate}
          onChange={(e) => setRenewalDate(e.target.value)}
          required
        />
      </div>

      <div className="color-picker">
        {DEFAULT_COLORS.map((c) => (
          <button
            type="button"
            key={c}
            className={`color-swatch ${color === c ? 'selected' : ''}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>

      <div className="form-actions">
        <button type="submit">{editingSubscription ? 'Save Changes' : 'Add Subscription'}</button>
        {editingSubscription && (
          <button type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AddSubscriptionForm;