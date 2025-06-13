// server/controllers/homeController.js
const HomeContent = require('../models/homeContent');

const groupBySection = (data) => {
  const result = {};

  data.forEach(({ section, key_name, value }) => {
    if (!result[section]) result[section] = {};
    result[section][key_name] = value;
  });

  return result;
};

const getHomeContent = async (req, res) => {
  try {
    const contents = await HomeContent.findAll();
    const structuredContent = groupBySection(contents);
    res.json(structuredContent);
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ error: 'Failed to fetch home page content' });
  }
};

module.exports = { getHomeContent };
