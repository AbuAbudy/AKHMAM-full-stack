// server/controllers/projectController.js
const path = require("path");
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
  const { section, ...textFields } = req.body;

  if (!section) {
    return res.status(400).json({ error: "Section is required" });
  }

  const updates = { ...textFields };

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      const relativePath = path.posix.join("uploads", file.filename);
updates[file.fieldname] = relativePath;



    });
  }

  try {
    await Promise.all(
      Object.entries(updates).map(async ([key, value]) => {
        const [record, created] = await ProjectContent.findOrCreate({
          where: { section, key },
          defaults: { value },
        });

        if (!created) {
          record.value = value;
          await record.save();
        }
      })
    );

    res.json({ message: `Project section "${section}" updated successfully.` });
  } catch (err) {
    console.error("Failed to update project content", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProjectContent,
  updateProjectContent,
};
