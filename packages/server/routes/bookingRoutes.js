const express = require('express');
const multer = require('multer');
const { handleVoiceBooking } = require('../controllers/bookingController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/voice-booking', upload.single('audio'), handleVoiceBooking);

module.exports = router;