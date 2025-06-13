const VolunteerContent = require("../models/VolunteerContent");

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
