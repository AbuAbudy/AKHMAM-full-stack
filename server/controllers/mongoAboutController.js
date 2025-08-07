const AboutContent = require('../models/mongo/aboutContent');
const path = require('path');

// Helper to group by section
const groupBySection = (data) => {
  const result = {};
  data.forEach(({ section, key_name, value }) => {
    if (!result[section]) result[section] = {};
    result[section][key_name] = value;
  });
  return result;
};

const getAboutContent = async (req, res) => {
  try {
    const contents = await AboutContent.find().lean();
    res.json(groupBySection(contents));
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ error: 'Failed to fetch about page content' });
  }
};

// Update general sections (hero, mission, vision, story, CTA)
const updateAboutContent = async (req, res) => {
  const section = req.body.section;
  if (!section) return res.status(400).json({ error: 'Section is required' });

  // For list sections, reject here — use separate routes (or later handle)
  if (section === 'whatWeDo' || section === 'coreValues') {
    return res.status(400).json({ error: `Use dedicated endpoints to modify ${section}` });
  }

  const updates = {};

  // Process text inputs
  for (const key in req.body) {
    if (key !== 'section') {
      updates[key] = req.body[key];
    }
  }

  // Process uploaded images
  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      const relativePath = path.join('assets', 'uploads', file.filename).replace(/\\/g, '/');
      updates[file.fieldname] = relativePath;
    });
  }

  try {
    await Promise.all(Object.entries(updates).map(async ([key_name, value]) => {
      const doc = await AboutContent.findOneAndUpdate(
        { section, key_name },
        { value },
        { new: true, upsert: true }
      );
      return doc;
    }));

    res.json({ message: `About content for section "${section}" updated successfully.` });
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ error: 'Failed to update about content' });
  }
};

// Get items for whatWeDo or coreValues as array [{_id, section, key_name, value}, ...]
const getListItems = async (req, res) => {
  const section = req.params.section;
  if (section !== 'whatWeDo' && section !== 'coreValues') {
    return res.status(400).json({ error: 'Invalid list section' });
  }
  try {
    const items = await AboutContent.find({ section }).sort({ _id: 1 }).lean();
    res.json(items);
  } catch (error) {
    console.error('Error fetching list items:', error);
    res.status(500).json({ error: 'Failed to fetch list items' });
  }
};

// Add a new item to whatWeDo or coreValues
const addListItem = async (req, res) => {
  const section = req.params.section;
  const { value } = req.body;
  if (!value || !section) {
    return res.status(400).json({ error: 'Section and value are required' });
  }
  if (section !== 'whatWeDo' && section !== 'coreValues') {
    return res.status(400).json({ error: 'Invalid list section' });
  }
  try {
    // Count documents for this section
    const count = await AboutContent.countDocuments({ section });
    const key_name = section === 'whatWeDo' ? `item_${count + 1}` : `value_${count + 1}`;

    const newItem = new AboutContent({ section, key_name, value });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding list item:', error);
    res.status(500).json({ error: 'Failed to add list item' });
  }
};

// Update an existing list item by id
const updateListItem = async (req, res) => {
  const id = req.params.id;
  const { value } = req.body;
  if (!value) {
    return res.status(400).json({ error: 'Value is required' });
  }
  try {
    const item = await AboutContent.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.value = value;
    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Error updating list item:', error);
    res.status(500).json({ error: 'Failed to update list item' });
  }
};

// Delete a list item by id, and re-number keys for order consistency
const deleteListItem = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await AboutContent.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    const section = item.section;

    await item.deleteOne();

    // Re-number keys in that section
    const items = await AboutContent.find({ section }).sort({ _id: 1 });
    for (let i = 0; i < items.length; i++) {
      const key_name = section === 'whatWeDo' ? `item_${i + 1}` : `value_${i + 1}`;
      if (items[i].key_name !== key_name) {
        items[i].key_name = key_name;
        await items[i].save();
      }
    }

    res.json({ message: 'Item deleted and keys re-numbered.' });
  } catch (error) {
    console.error('Error deleting list item:', error);
    res.status(500).json({ error: 'Failed to delete list item' });
  }
};

module.exports = {
  getAboutContent,
  updateAboutContent,
  getListItems,
  addListItem,
  updateListItem,
  deleteListItem,
};
