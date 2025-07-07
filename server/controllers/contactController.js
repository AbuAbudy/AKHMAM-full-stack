const ContactContent = require("../models/contactContent");

// GET all grouped by section
const getContactContent = async (req, res) => {
  try {
    const rows = await ContactContent.findAll();
    const result = {};

    rows.forEach(({ section, key, value }) => {
      if (!result[section]) result[section] = {};

      // For messages, parse value (JSON)
      if (section === 'messages') {
        if (!result[section].list) result[section].list = [];
        result[section].list.push({ key, ...JSON.parse(value) });
      } else {
        result[section][key] = value;
      }
    });

    // Sort messages newest first
    if (result.messages?.list) {
      result.messages.list.sort((a, b) => b.key.localeCompare(a.key));
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching contact content:", error);
    res.status(500).json({ message: "Server error fetching contact content" });
  }
};

// PUT update multiple keys in a section
const updateContactSection = async (req, res) => {
  const { section } = req.params;
  const updates = req.body;

  try {
    const updatePromises = Object.entries(updates).map(([key, value]) =>
      ContactContent.update({ value }, { where: { section, key } })
    );
    await Promise.all(updatePromises);
    res.json({ message: `Section "${section}" updated successfully.` });
  } catch (error) {
    console.error("Error updating contact section:", error);
    res.status(500).json({ message: "Server error updating contact section" });
  }
};

// POST new contact message
const submitContactMessage = async (req, res) => {
  const { fullName, email, subject, message } = req.body;
  if (!fullName || !email || !subject || !message)
    return res.status(400).json({ message: "All fields required." });

  try {
    const timestamp = Date.now().toString();
    await ContactContent.create({
      section: 'messages',
      key: timestamp,
      value: JSON.stringify({ fullName, email, subject, message }),
    });

    res.status(201).json({ message: 'Message received successfully.' });
  } catch (err) {
    console.error('Failed to save message:', err);
    res.status(500).json({ message: 'Server error saving message' });
  }
};

// DELETE a message by its key
const deleteContactMessage = async (req, res) => {
  const { key } = req.params;
  try {
    const deleted = await ContactContent.destroy({
      where: { section: 'messages', key }
    });

    if (deleted) {
      res.json({ message: 'Message deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Message not found.' });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error deleting message.' });
  }
};

module.exports = {
  getContactContent,
  updateContactSection,
  submitContactMessage,
  deleteContactMessage,
};
