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
    console.error("Error loading project content:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProjectContent = async (req, res) => {
  // Use req.body.section and all other keys
  const { section, ...rest } = req.body;

  if (!section) {
    return res.status(400).json({ error: "Section is required" });
  }

  // For images, multer puts them in req.files as array
  // Map files by fieldname to file path
  const fileMap = {};
  if (req.files && req.files.length) {
    req.files.forEach((file) => {
      const relativePath = path.posix.join("assets", "uploads", file.filename);
      fileMap[file.fieldname] = relativePath;
    });
  }

  try {
    // Combine text fields and uploaded files
    const updates = { ...rest, ...fileMap };

    // Iterate keys and update/create in DB
    await Promise.all(
      Object.entries(updates).map(async ([key, value]) => {
        // Ignore undefined or null values to avoid overwriting
        if (value === undefined || value === null) return;

        const [record, created] = await ProjectContent.findOrCreate({
          where: { section, key },
          defaults: { value: value.toString() },
        });

        if (!created) {
          record.value = value.toString();
          await record.save();
        }
      })
    );

    res.json({ message: `Section "${section}" updated successfully.` });
  } catch (err) {
    console.error("Error updating project content:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProjectContent,
  updateProjectContent,
};