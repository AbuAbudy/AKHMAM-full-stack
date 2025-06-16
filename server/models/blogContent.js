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
  likes: {
    type: DataTypes.JSON,
  },
  comments: {
    type: DataTypes.JSON,
  },
}, {
  tableName: 'blog_contents',
  timestamps: false,
});

module.exports = BlogContent;
