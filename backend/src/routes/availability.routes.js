import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Availability routes - Coming soon' });
});

export default router;
