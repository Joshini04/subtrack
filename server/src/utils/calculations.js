function toMonthlyEquivalent(cost, billingCycle) {
  return billingCycle === 'yearly' ? cost / 12 : cost;
}

function toAnnualEquivalent(cost, billingCycle) {
  return billingCycle === 'yearly' ? cost : cost * 12;
}

function calculateTotals(subscriptions) {
  const totalMonthly = subscriptions.reduce(
    (sum, sub) => sum + toMonthlyEquivalent(parseFloat(sub.cost), sub.billing_cycle),
    0
  );

  const totalAnnual = subscriptions.reduce(
    (sum, sub) => sum + toAnnualEquivalent(parseFloat(sub.cost), sub.billing_cycle),
    0
  );

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    totalAnnual: Math.round(totalAnnual * 100) / 100,
  };
}

module.exports = { toMonthlyEquivalent, toAnnualEquivalent, calculateTotals };