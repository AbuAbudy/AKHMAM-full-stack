const DonateContent = require('../models/DonateContent');

const getDonatePageContent = async (req, res) => {
  try {
    const rows = await DonateContent.findAll();
    const structuredData = {};

    rows.forEach(({ section, key_name, value }) => {
      if (!structuredData[section]) {
        structuredData[section] = {};
      }
      structuredData[section][key_name] = value;
    });

    res.json(structuredData);
  } catch (error) {
    console.error('Error fetching donate page content:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getDonatePageContent };
