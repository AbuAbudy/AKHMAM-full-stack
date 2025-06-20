const ContactContent = require('../models/contactContent');

// GET all grouped by section
const getContactContent = async (req, res) => {
  try {
    const rows = await ContactContent.findAll();
    const result = {};

    rows.forEach(({ section, key, value }) => {
      if (!result[section]) result[section] = {};
      result[section][key] = value;
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching contact content:', error);
    res.status(500).json({ message: 'Server error fetching contact content' });
  }
};

// PUT update value by ID
const updateContactContent = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    const item = await ContactContent.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Contact content not found' });
    }

    item.value = value;
    await item.save();

    res.json({ message: 'Contact content updated successfully', content: item });
  } catch (error) {
    console.error('Error updating contact content:', error);
    res.status(500).json({ message: 'Server error updating contact content' });
  }
};

module.exports = {
  getContactContent,
  updateContactContent
};
