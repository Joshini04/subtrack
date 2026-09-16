const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendRenewalReminder(userEmail, userName, subscriptions) {
  const subscriptionList = subscriptions
    .map((sub) => `<li>${sub.name} — $${parseFloat(sub.cost).toFixed(2)} (${sub.billing_cycle}), renewing ${new Date(sub.next_renewal_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })}</li>`)
    .join('');

  try {
    await resend.emails.send({
      from: 'SubTrack <onboarding@resend.dev>',
      to: userEmail,
      subject: `Reminder: ${subscriptions.length} subscription${subscriptions.length > 1 ? 's' : ''} renewing soon`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2>Hi ${userName},</h2>
          <p>Here's what's renewing soon:</p>
          <ul>${subscriptionList}</ul>
          <p>Log in to SubTrack to review or cancel anything before it renews.</p>
        </div>
      `,
    });
    console.log(`Reminder email sent to ${userEmail}`);
  } catch (err) {
    console.error(`Failed to send email to ${userEmail}:`, err);
  }
}

module.exports = { sendRenewalReminder };