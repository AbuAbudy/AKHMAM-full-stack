const ProjectContent = require("../models/ProjectContent");

exports.getProjectContent = async (req, res) => {
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
