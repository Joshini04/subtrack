const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  getSubscriptions,
  getRenewingSoon,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} = require('../controllers/subscriptions.controller');

router.use(authenticateToken); // every route below this requires a valid JWT

router.get('/', getSubscriptions);
router.get('/renewing-soon', getRenewingSoon);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;