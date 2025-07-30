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
    type: DataTypes.TEXT, // stored as stringified JSON
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('tags');
      try {
        return JSON.parse(value || '[]');
      } catch {
        return [];
      }
    },
    set(val) {
      this.setDataValue('tags', JSON.stringify(val || []));
    },
  },

  likes: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('likes');
      try {
        return JSON.parse(value || '[]');
      } catch {
        return [];
      }
    },
    set(val) {
      this.setDataValue('likes', JSON.stringify(val || []));
    },
  },

  comments: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const value = this.getDataValue('comments');
      try {
        return JSON.parse(value || '[]');
      } catch {
        return [];
      }
    },
    set(val) {
      this.setDataValue('comments', JSON.stringify(val || []));
    },
  },
}, {
  tableName: 'blog_contents',
  timestamps: false,
});

module.exports = BlogContent;