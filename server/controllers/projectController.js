const ProjectContent = require("../models/ProjectContent");

const getProjectContent = async (req, res) => {
  try {
    const rows = await ProjectContent.findAll();
    const result = {};

    rows.forEach(({ section, key, value }) => {
      if (!result[section]) result[section] = {};
      result[section][key] = value;
    });

    res.json(result);
  } catch (err) {
    console.error("Failed to load project content", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProjectContent = async (req, res) => {
  try {
    const { section, key, value } = req.body;

    if (!section || !key || !value) {
      return res.status(400).json({ message: "section, key, and value are required" });
    }

    const existing = await ProjectContent.findOne({ where: { section, key } });
    if (existing) {
      existing.value = value;
      await existing.save();
    } else {
      await ProjectContent.create({ section, key, value });
    }

    res.json({ message: "Project content updated successfully" });
  } catch (err) {
    console.error("Failed to update project content", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProjectContent,
  updateProjectContent,
};
