function RenewingSoon({ subscriptions }) {
  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="renewing-soon">
      <h3>Renewing Soon</h3>
      <ul>
        {subscriptions.map((sub) => {
          const date = new Date(sub.next_renewal_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          });
          return (
            <li key={sub.id}>
              <span>{sub.name}</span>
              <span>{date}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RenewingSoon;