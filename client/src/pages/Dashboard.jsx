import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptions as subsApi, clearToken } from '../api/client';
import SummaryCards from '../components/SummaryCards';
import SubscriptionGrid from '../components/SubscriptionGrid';
import AddSubscriptionForm from '../components/AddSubscriptionForm';
import RenewingSoon from '../components/RenewingSoon';

function Dashboard() {
  const [subs, setSubs] = useState([]);
  const [totals, setTotals] = useState({ totalMonthly: 0, totalAnnual: 0 });
  const [renewingSoon, setRenewingSoon] = useState([]);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reminderDays, setReminderDays] = useState(() => {
    return parseInt(localStorage.getItem('reminderDays')) || 7;
  });
  const navigate = useNavigate();

  async function loadData(days = reminderDays) {
    try {
      const [subsData, renewingData] = await Promise.all([
        subsApi.getAll(),
        subsApi.getRenewingSoon(days),
      ]);
      setSubs(subsData.subscriptions);
      setTotals(subsData.totals);
      setRenewingSoon(renewingData.renewingSoon);
      maybeNotify(renewingData.renewingSoon);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function maybeNotify(items) {
    if (items.length === 0) return;
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          showNotification(items);
        }
      });
    } else if (Notification.permission === 'granted') {
      showNotification(items);
    }
  }

  function showNotification(items) {
    const shownKey = `notified-${new Date().toDateString()}`;
    if (sessionStorage.getItem(shownKey)) return;

    const names = items.map((s) => s.name).join(', ');
    const body =
      items.length === 1
        ? `${names} renews soon`
        : `${items.length} subscriptions renewing soon: ${names}`;

    new Notification('SubTrack reminder', {
      body,
      icon: '/favicon.ico',
    });

    sessionStorage.setItem(shownKey, 'true');
  }

  function handleReminderChange(e) {
    const days = parseInt(e.target.value);
    setReminderDays(days);
    localStorage.setItem('reminderDays', days);
    loadData(days);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAddOrUpdate(subData) {
    try {
      if (editingSubscription) {
        await subsApi.update(editingSubscription.id, subData);
        setEditingSubscription(null);
      } else {
        await subsApi.create(subData);
      }
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this subscription?')) return;
    try {
      await subsApi.delete(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearToken();
    navigate('/login');
  }

  if (loading) return <p className="loading-state">Loading your dashboard...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          SubTrack
          {renewingSoon.length > 0 && <span className="badge">{renewingSoon.length}</span>}
        </h1>
        <button onClick={handleLogout}>Log out</button>
      </header>

      {error && <p className="error-message">{error}</p>}

      <SummaryCards totalMonthly={totals.totalMonthly} totalAnnual={totals.totalAnnual} />

      <div className="reminder-settings">
        <label>
          Remind me
          <select value={reminderDays} onChange={handleReminderChange}>
            <option value={1}>1 day before</option>
            <option value={3}>3 days before</option>
            <option value={7}>1 week before</option>
            <option value={14}>2 weeks before</option>
          </select>
        </label>
      </div>

      <RenewingSoon subscriptions={renewingSoon} />

      <AddSubscriptionForm
        onSubmit={handleAddOrUpdate}
        editingSubscription={editingSubscription}
        onCancelEdit={() => setEditingSubscription(null)}
      />

      <SubscriptionGrid
        subscriptions={subs}
        onDelete={handleDelete}
        onEdit={setEditingSubscription}
      />
    </div>
  );
}

export default Dashboard;