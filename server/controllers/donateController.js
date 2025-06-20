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
    const structuredData = groupBySection(rows);
    res.json(structuredData);
  } catch (error) {
    console.error('Error fetching donate content:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDonateContent = async (req, res) => {
  const { section, updates } = req.body;
  if (!section || !updates) {
    return res.status(400).json({ error: 'Section and updates object are required' });
  }

  try {
    for (const key in updates) {
      await DonateContent.update(
        { value: updates[key] },
        { where: { section, key_name: key } }
      );
    }
    res.json({ message: `Donate content for section "${section}" updated successfully.` });
  } catch (error) {
    console.error('Error updating donate content:', error);
    res.status(500).json({ error: 'Failed to update donate content' });
  }
};

module.exports = { getDonateContent, updateDonateContent };
