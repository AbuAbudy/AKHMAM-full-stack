const ContactContent = require('../models/contactContent');

// GET all contact page contents
exports.getContactContent = async (req, res) => {
  try {
    const contents = await ContactContent.findAll();
    res.json(contents);
  } catch (error) {
    console.error('Error fetching contact content:', error);
    res.status(500).json({ message: 'Server error fetching contact content' });
  }
};

// PUT update contact page content by id
exports.updateContactContent = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  try {
    const content = await ContactContent.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Contact content not found' });
    }
    content.value = value;
    await content.save();
    res.json({ message: 'Contact content updated successfully', content });
  } catch (error) {
    console.error('Error updating contact content:', error);
    res.status(500).json({ message: 'Server error updating contact content' });
  }
};
