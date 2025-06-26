const ContactContent = require("../models/contactContent");

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
    console.error("Error fetching contact content:", error);
    res.status(500).json({ message: "Server error fetching contact content" });
  }
};

// PUT update multiple keys in a section
const updateContactSection = async (req, res) => {
  const { section } = req.params;
  const updates = req.body; // expected: { key1: val1, key2: val2, ... }

  try {
    // Update all keys one by one in DB
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

module.exports = {
  getContactContent,
  updateContactSection,
};
