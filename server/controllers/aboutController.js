// server/controllers/aboutController.js
const AboutContent = require('../models/aboutContentModel');

// GET /api/about - Public
const getAboutContent = async (req, res) => {
  try {
    const contents = await AboutContent.findAll();

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

// PUT /api/about - Admin-only
const updateAboutContent = async (req, res) => {
  const { section, updates } = req.body;

  if (!section || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Section and updates object are required' });
  }

  try {
    for (const key_name in updates) {
      const value = updates[key_name];

      const [record, created] = await AboutContent.findOrCreate({
        where: { section, key_name },
        defaults: { value },
      });

      if (!created) {
        record.value = value;
        await record.save();
      }
    }

    res.json({ message: `About content for section "${section}" updated successfully.` });
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ error: 'Failed to update about content' });
  }
};

module.exports = { getAboutContent, updateAboutContent };
