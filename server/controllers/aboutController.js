// server/controllers/aboutController.js
const AboutContent = require('../models/aboutContentModel');

const getAboutContent = async (req, res) => {
  try {
    const contents = await AboutContent.findAll();

    // Organize data by section and key
    const formattedContent = {};
    contents.forEach(item => {
      if (!formattedContent[item.section]) {
        formattedContent[item.section] = {};
      }
      formattedContent[item.section][item.key_name] = item.value;
    });

    res.json(formattedContent);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAboutContent };
