require('dotenv').config();  // <-- must be at the top before anything else

const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', bookingRoutes);

app.listen(3001, () => {
  console.log('✅ Server running at http://localhost:3001');
});
