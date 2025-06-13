const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectContent = sequelize.define("projects_contents", {
  section: DataTypes.STRING,
  key: DataTypes.STRING,
  value: DataTypes.TEXT,
}, {
  timestamps: false,
});

module.exports = ProjectContent;
