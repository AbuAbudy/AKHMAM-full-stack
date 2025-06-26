const path = require("path");
const VolunteerContent = require("../models/VolunteerContent");

// GET all volunteer content, grouped by section
exports.getVolunteerPageContent = async (req, res) => {
  try {
    const rows = await VolunteerContent.findAll();

    const content = {};
    rows.forEach((row) => {
      if (!content[row.section]) content[row.section] = {};
      content[row.section][row.key] = row.value;
    });

    res.json(content);
  } catch (error) {
    console.error("Error fetching volunteer content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT update or create volunteer content, handle text and files
exports.updateVolunteerContent = async (req, res) => {
  try {
    const { section, ...textFields } = req.body;

    if (!section) {
      return res.status(400).json({ message: "Section is required" });
    }

    const updates = { ...textFields };

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const relativePath = path.posix.join("assets", "uploads", file.filename);
        updates[file.fieldname] = `/${relativePath}`;
      });
    }

    // Update or create all key-value pairs
    await Promise.all(
      Object.entries(updates).map(async ([key, value]) => {
        const [record, created] = await VolunteerContent.findOrCreate({
          where: { section, key },
          defaults: { value },
        });
        if (!created) {
          record.value = value;
          await record.save();
        }
      })
    );

    res
      .status(200)
      .json({ message: `✅ "${section}" content updated successfully.` });
  } catch (error) {
    console.error("Error updating volunteer content:", error);
    res
      .status(500)
      .json({ message: "Failed to update volunteer content", error: error.message });
  }
};
