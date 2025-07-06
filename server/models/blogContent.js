const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogContent = sequelize.define('BlogContent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  image: {
    type: DataTypes.STRING,
  },

  description: {
    type: DataTypes.TEXT,
  },

  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
  },

  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },

  likes: {
    type: DataTypes.JSON,
    defaultValue: [],
  },

  comments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: 'blog_contents',
  timestamps: false,
});

module.exports = BlogContent;