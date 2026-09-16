const pool = require('../config/db');
const { sendRenewalReminder } = require('./email');

async function runReminderJob() {
  console.log('Running renewal reminder job...');

  try {
    const result = await pool.query(`
      SELECT
        u.id AS user_id,
        u.name,
        u.email,
        s.id AS sub_id,
        s.name AS sub_name,
        s.cost,
        s.billing_cycle,
        s.next_renewal_date
      FROM subscriptions s
      JOIN users u ON u.id = s.user_id
      WHERE s.next_renewal_date - CURRENT_DATE = 7
         OR s.next_renewal_date - CURRENT_DATE = 3
         OR s.next_renewal_date - CURRENT_DATE = 1
      ORDER BY u.id
    `);

    const byUser = {};
    for (const row of result.rows) {
      if (!byUser[row.user_id]) {
        byUser[row.user_id] = { name: row.name, email: row.email, subs: [] };
      }
      byUser[row.user_id].subs.push({
        name: row.sub_name,
        cost: row.cost,
        billing_cycle: row.billing_cycle,
        next_renewal_date: row.next_renewal_date,
      });
    }

    const userIds = Object.keys(byUser);
    console.log(`Found ${userIds.length} user(s) with upcoming renewals`);

    for (const userId of userIds) {
      const { name, email, subs } = byUser[userId];
      await sendRenewalReminder(email, name, subs);
    }

    console.log('Reminder job complete');
  } catch (err) {
    console.error('Reminder job failed:', err);
  }
}

module.exports = { runReminderJob };