const path = require("path");
const VolunteerContent = require("../models/mongo/volunteerContent"); // ✅ lowercase filename

// GET all volunteer content, grouped by section
exports.getVolunteerPageContent = async (req, res) => {
  try {
    const rows = await VolunteerContent.find({});
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

    await Promise.all(
      Object.entries(updates).map(async ([key, value]) => {
        await VolunteerContent.findOneAndUpdate(
          { section, key },
          { value },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      })
    );

    res.status(200).json({ message: `✅ "${section}" content updated successfully.` });
  } catch (error) {
    console.error("Error updating volunteer content:", error);
    res.status(500).json({ message: "Failed to update volunteer content", error: error.message });
  }
};

// POST volunteer application
exports.submitVolunteerApplication = async (req, res) => {
  try {
    const { name, email, phone, interest, message } = req.body;

    if (!name || !email || !phone || !interest) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const timestamp = new Date().toISOString();
    const key = `application_${Date.now()}`;

    const data = {
      name,
      email,
      phone,
      interest,
      message: message || "",
      timestamp,
    };

    await VolunteerContent.create({
      section: "applications",
      key,
      value: JSON.stringify(data),
    });

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error submitting volunteer application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET all volunteer applications
exports.getVolunteerApplications = async (req, res) => {
  try {
    const records = await VolunteerContent.find({ section: "applications" }).sort({ _id: -1 });

    const applications = records.map((r) => {
      try {
        return { ...JSON.parse(r.value), key: r.key };
      } catch {
        return null;
      }
    }).filter(Boolean);

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// DELETE application
exports.deleteVolunteerApplication = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await VolunteerContent.deleteOne({ section: "applications", key });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ message: "Failed to delete application" });
  }
};