const path = require('path');
const DonateContent = require('../models/mongo/donateContent');

// Group DB rows by section and key
const groupBySection = (data) => {
  const result = {};
  data.forEach(({ section, key_name, value }) => {
    if (!result[section]) result[section] = {};
    result[section][key_name] = value;
  });
  return result;
};

// Generate proof key (e.g., proof_1, proof_2)
const generateProofKey = (existingKeys) => {
  let maxNum = 0;
  existingKeys.forEach((key) => {
    const m = key.match(/^proof_(\d+)$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > maxNum) maxNum = n;
    }
  });
  return `proof_${maxNum + 1}`;
};

// GET /api/donate
const getDonateContent = async (req, res) => {
  try {
    const rows = await DonateContent.find().sort({ _id: 1 }).lean();
    res.json(groupBySection(rows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/donate
const updateDonateContent = async (req, res) => {
  const section = req.body.section;
  if (!section) {
    return res.status(400).json({ error: 'Section is required' });
  }

  const updates = {};
  for (const [key, value] of Object.entries(req.body)) {
    if (key !== 'section') updates[key] = value;
  }

  if (req.files?.length) {
    req.files.forEach((file) => {
      const relativePath = path.posix.join('assets', 'uploads', file.filename);
      updates[file.fieldname] = `/${relativePath}`;
    });
  }

  try {
    // Upsert all keys present in updates
    for (const [key_name, value] of Object.entries(updates)) {
      await DonateContent.findOneAndUpdate(
        { section, key_name },
        { value },
        { new: true, upsert: true }
      );
    }

    // Delete keys NOT in the current updates for this section
    const allDocs = await DonateContent.find({ section }, 'key_name').lean();
    const keysInDB = allDocs.map(doc => doc.key_name);
    const keysToDelete = keysInDB.filter(key => !Object.keys(updates).includes(key));

    if (keysToDelete.length > 0) {
      await DonateContent.deleteMany({
        section,
        key_name: { $in: keysToDelete },
      });
    }

    res.json({ message: `${section} section updated successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update donate content' });
  }
};

// POST /api/donate/submit-proof
const submitDonationProof = async (req, res) => {
  try {
    const { name, amount, reason, email } = req.body;
    if (!name || !amount || !reason) {
      return res.status(400).json({ error: 'Name, amount, and reason are required' });
    }

    const screenshot = req.file ? `/assets/uploads/${req.file.filename}` : null;

    const existing = await DonateContent.find({ section: 'donationProof' }, 'key_name').lean();
    const keys = existing.map(r => r.key_name);
    const newKey = generateProofKey(keys);

    const data = {
      name,
      amount,
      reason,
      email: email || '',
      screenshot,
      timestamp: new Date().toISOString(),
    };

    const newDoc = new DonateContent({
      section: 'donationProof',
      key_name: newKey,
      value: JSON.stringify(data),
    });
    await newDoc.save();

    res.json({ message: 'Donation proof submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit donation proof' });
  }
};

// DELETE /api/donate/proof/:key
const deleteDonationProof = async (req, res) => {
  const { key } = req.params;
  try {
    const deleted = await DonateContent.deleteOne({
      section: 'donationProof',
      key_name: key,
    });

    if (deleted.deletedCount > 0) {
      res.json({ message: 'Donation proof deleted.' });
    } else {
      res.status(404).json({ error: 'Proof not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete donation proof' });
  }
};

module.exports = {
  getDonateContent,
  updateDonateContent,
  submitDonationProof,
  deleteDonationProof,
};
