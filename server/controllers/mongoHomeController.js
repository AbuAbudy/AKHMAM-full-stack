// server/controllers/homeController.js
const HomeContent = require('../models/mongo/home_Contents');
const path = require('path');

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
    const contents = await HomeContent.find().lean();
    const structuredContent = groupBySection(contents);
    res.json(structuredContent);
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({ error: 'Failed to fetch home page content' });
  }
};

const updateHomeContent = async (req, res) => {
  const section = req.body.section;
  if (!section) {
    return res.status(400).json({ error: 'Section is required' });
  }

  const updates = {};

  // Handle text fields
  for (const key in req.body) {
    if (key !== 'section') {
      updates[key] = req.body[key];
    }
  }

  // Handle image fields (from req.files)
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      const relativePath = path.join('assets', 'uploads', file.filename);
      updates[file.fieldname] = relativePath.replace(/\\/g, '/');
    });
  }

  try {
    // For each key_name, update or create a document
    const updatePromises = Object.entries(updates).map(async ([key_name, value]) => {
      const doc = await HomeContent.findOneAndUpdate(
        { section, key_name },
        { value },
        { new: true, upsert: true }
      );
      return doc;
    });

    await Promise.all(updatePromises);

    res.json({ message: `Home content for section "${section}" updated successfully.` });
  } catch (error) {
    console.error('Error updating home content:', error);
    res.status(500).json({ error: 'Failed to update home content' });
  }
};

module.exports = { getHomeContent, updateHomeContent };
