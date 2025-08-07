const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const mongoAuthRoutes = require('./routes/mongoAuthRoutes');
const mongoBlogRoutes = require('./routes/mongoBlogRoutes');
const mongoHomeRoutes = require('./routes/mongoHomeRoutes');
const mongoAboutRoutes = require('./routes/mongoAboutRoutes');
const mongoUserRoutes = require('./routes/mongoUserRoutes');
const mongoDonateRoutes = require('./routes/mongoDonateRoutes');
const mongoVolunteerRoutes = require('./routes/mongoVolunteerRoutes');
const mongoProjectRoutes = require('./routes/mongoProjectRoutes');
const mongoContactRoutes = require('./routes/mongoContactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allow CORS from both Netlify and local frontend
const allowedOrigins = ['https://akmam.netlify.app', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// ✅ Serve static files
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(express.static('public'));
app.use('/assets/uploads', express.static(path.join(__dirname, 'public/assets/uploads')));
app.use('/assets/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Akmam backend is running');
});

// ✅ API routes
app.use('/api', mongoBlogRoutes);
app.use('/api', mongoHomeRoutes);
app.use('/api', mongoAboutRoutes);
app.use('/api', mongoUserRoutes);
app.use('/api/donate', mongoDonateRoutes);
app.use('/api/volunteers', mongoVolunteerRoutes);
app.use('/api/projects', mongoProjectRoutes);
app.use('/api/contact', mongoContactRoutes);
app.use('/api/auth', mongoAuthRoutes);

// ✅ MongoDB connection with environment-based URI
const mongoUri = process.env.NODE_ENV === 'production'
  ? process.env.MONGODB_URI
  : 'mongodb://127.0.0.1:27017/akhmamdb';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
  });
  