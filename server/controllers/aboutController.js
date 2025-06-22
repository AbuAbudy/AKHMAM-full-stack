const AboutContent = require('../models/aboutContent');
const path = require('path');

const groupBySection = (data) => {
  const result = {};
  data.forEach(({ section, key_name, value }) => {
    if (!result[section]) result[section] = {};
    result[section][key_name] = value;
  });
  return result;
};

const getAboutContent = async (req, res) => {
  try {
    const contents = await AboutContent.findAll();
    res.json(groupBySection(contents));
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ error: 'Failed to fetch about page content' });
  }
};

const updateAboutContent = async (req, res) => {
  const section = req.body.section;
  if (!section) return res.status(400).json({ error: 'Section is required' });

  const updates = {};

  for (const key in req.body) {
    if (key !== 'section') {
      updates[key] = req.body[key];
    }
  }

  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      const relativePath = path.join('assets', 'uploads', file.filename).replace(/\\/g, '/');
      updates[file.fieldname] = relativePath;
    });
  }

  try {
    await Promise.all(Object.entries(updates).map(async ([key_name, value]) => {
      const [record, created] = await AboutContent.findOrCreate({
        where: { section, key_name },
        defaults: { value },
      });

      if (!created) {
        record.value = value;
        await record.save();
      }
    }));

    res.json({ message: `About content for section "${section}" updated successfully.` });
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ error: 'Failed to update about content' });
  }
};

module.exports = { getAboutContent, updateAboutContent };
