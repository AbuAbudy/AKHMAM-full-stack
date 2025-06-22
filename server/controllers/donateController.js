const path = require('path');
const DonateContent = require('../models/DonateContent');

const groupBySection = (data) => {
  const result = {};
  data.forEach(({ section, key_name, value }) => {
    if (!result[section]) result[section] = {};
    result[section][key_name] = value;
  });
  return result;
};

const getDonateContent = async (req, res) => {
  try {
    const rows = await DonateContent.findAll();
    const structured = groupBySection(rows);
    res.json(structured);
  } catch (err) {
    console.error('❌ Error fetching donate content:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDonateContent = async (req, res) => {
  const section = req.body.section;
  if (!section) {
    return res.status(400).json({ error: 'Section is required' });
  }

  const updates = {};

  // Text fields
  for (const key in req.body) {
    if (key !== 'section') {
      updates[key] = req.body[key];
    }
  }

  // Uploaded images
  if (req.files?.length > 0) {
    req.files.forEach(file => {
      const relativePath = path.posix.join('assets', 'uploads', file.filename);
      updates[file.fieldname] = `/${relativePath}`;
    });
  }

  try {
    // Save to DB
    await Promise.all(Object.entries(updates).map(async ([key_name, value]) => {
      const [record, created] = await DonateContent.findOrCreate({
        where: { section, key_name },
        defaults: { value }
      });
      if (!created) {
        record.value = value;
        await record.save();
      }
    }));

    res.json({ message: `${section} section updated successfully.` });
  } catch (err) {
    console.error('❌ Error updating content:', err);
    res.status(500).json({ error: 'Failed to update donate content' });
  }
};

module.exports = { getDonateContent, updateDonateContent };
