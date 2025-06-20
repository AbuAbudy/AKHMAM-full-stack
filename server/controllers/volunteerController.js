const VolunteerContent = require("../models/VolunteerContent");

// GET all volunteer content, grouped by section
exports.getVolunteerPageContent = async (req, res) => {
  try {
    const rows = await VolunteerContent.findAll();

    const content = {};
    rows.forEach(row => {
      if (!content[row.section]) content[row.section] = {};
      content[row.section][row.key] = row.value;
    });

    res.json(content);
  } catch (error) {
    console.error("Error fetching volunteer content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT update or create a volunteer content key-value in a section
exports.updateVolunteerContent = async (req, res) => {
  try {
    const { section, key, value } = req.body;

    if (!section || !key || !value) {
      return res.status(400).json({ message: "Section, key and value are required" });
    }

    const content = await VolunteerContent.findOne({ where: { section, key } });
    if (content) {
      content.value = value;
      await content.save();
    } else {
      await VolunteerContent.create({ section, key, value });
    }

    res.status(200).json({ message: "Volunteer content updated successfully" });
  } catch (error) {
    console.error("Error updating volunteer content:", error);
    res.status(500).json({ message: "Failed to update volunteer content", error: error.message });
  }
};
