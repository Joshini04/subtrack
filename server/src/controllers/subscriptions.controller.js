const pool = require('../config/db');
const { calculateTotals } = require('../utils/calculations');

async function getSubscriptions(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY next_renewal_date ASC',
      [req.user.id]
    );

    const totals = calculateTotals(result.rows);

    res.json({ subscriptions: result.rows, totals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching subscriptions' });
  }
}

async function getRenewingSoon(req, res) {
  try {
    const days = parseInt(req.query.days) || 30;

    const result = await pool.query(
      `SELECT * FROM subscriptions
       WHERE user_id = $1
       AND next_renewal_date BETWEEN CURRENT_DATE AND CURRENT_DATE + $2 * INTERVAL '1 day'
       ORDER BY next_renewal_date ASC`,
      [req.user.id, days]
    );

    res.json({ renewingSoon: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching renewals' });
  }
}

async function createSubscription(req, res) {
  try {
    const { name, cost, billing_cycle, next_renewal_date, color } = req.body;

    if (!name || !cost || !billing_cycle || !next_renewal_date) {
      return res.status(400).json({ error: 'Name, cost, billing cycle, and renewal date are required' });
    }

    if (!['monthly', 'yearly'].includes(billing_cycle)) {
      return res.status(400).json({ error: 'Billing cycle must be monthly or yearly' });
    }

    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, name, cost, billing_cycle, next_renewal_date, color)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, name, cost, billing_cycle, next_renewal_date, color || '#6366f1']
    );

    res.status(201).json({ subscription: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating subscription' });
  }
}

async function updateSubscription(req, res) {
  try {
    const { id } = req.params;
    const { name, cost, billing_cycle, next_renewal_date, color } = req.body;

    const existing = await pool.query('SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2', [
      id,
      req.user.id,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const result = await pool.query(
      `UPDATE subscriptions
       SET name = $1, cost = $2, billing_cycle = $3, next_renewal_date = $4, color = $5
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [name, cost, billing_cycle, next_renewal_date, color, id, req.user.id]
    );

    res.json({ subscription: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating subscription' });
  }
}

async function deleteSubscription(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM subscriptions WHERE id = $1 AND user_id = $2 RETURNING *', [
      id,
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting subscription' });
  }
}

module.exports = {
  getSubscriptions,
  getRenewingSoon,
  createSubscription,
  updateSubscription,
  deleteSubscription,
};