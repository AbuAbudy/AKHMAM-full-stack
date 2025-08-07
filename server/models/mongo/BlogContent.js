// models/mongo/BlogContent.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Anonymous',
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const blogContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: String,
    description: String,
    category: {
      type: String,
      default: 'General',
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogContent', blogContentSchema);