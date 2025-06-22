require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// Routes
const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const donateRoutes = require('./routes/donateRoutes');
const volunteerRoutes = require("./routes/volunteerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static files (for images in /public/assets)
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ✅ Routes
app.use('/api', userRoutes);
app.use('/api', homeRoutes);
app.use('/api', aboutRoutes);
app.use('/api/donate', donateRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);  // Added auth routes

// ✅ Test DB connection & start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to the database successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });
