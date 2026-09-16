const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const subscriptionRoutes = require('./routes/subscriptions.routes');
const { runReminderJob } = require('./utils/reminderJob');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SubTrack API is running' });
});

app.get('/api/cron/run-reminders', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await runReminderJob();
  res.json({ message: 'Reminder job executed' });
});

module.exports = app;