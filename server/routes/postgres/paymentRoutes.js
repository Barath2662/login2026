const express = require('express');
const multer = require('multer');
const { verifyJwt } = require('../../middleware/auth');
const allowRoles = require('../../middleware/allowRoles');
const paymentController = require('../../controllers/postgres/paymentController');

const router = express.Router();

// multer: store CSV in memory (no disk write needed — we parse the buffer directly)
const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// ── Participant ──────────────────────────────────────
router.get('/my', verifyJwt, allowRoles('student'), paymentController.getMyPayment);
router.post('/', verifyJwt, allowRoles('student'), paymentController.createPayment);

// ── Admin + Coordinator (read all payments) ──────────
router.get(
  '/',
  verifyJwt,
  allowRoles('admin', 'coordinator'),
  paymentController.getAllPayments
);

// ── Admin + Coordinator (manual verify / reject) ─────
router.put(
  '/:id/verify',
  verifyJwt,
  allowRoles('admin', 'coordinator'),
  paymentController.verifyPayment
);

// ── Admin + Coordinator (CSV upload → match) ─────────
router.post(
  '/upload-csv',
  verifyJwt,
  allowRoles('admin', 'coordinator'),
  csvUpload.single('csv'),
  paymentController.uploadAndMatchCsv
);

// ── Admin + Coordinator (bulk verify from CSV match) ──
router.post(
  '/bulk-verify',
  verifyJwt,
  allowRoles('admin', 'coordinator'),
  paymentController.bulkVerify
);

// ── Admin only (refund) ───────────────────────────────
router.put(
  '/:id/refund',
  verifyJwt,
  allowRoles('admin'),
  paymentController.initiateRefund
);

module.exports = router;
