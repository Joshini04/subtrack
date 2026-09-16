const { runReminderJob } = require('./src/utils/reminderJob');

runReminderJob().then(() => {
  console.log('Test complete');
  process.exit(0);
});