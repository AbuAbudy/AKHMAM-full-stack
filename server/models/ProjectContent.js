const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectContent = sequelize.define(
  "ProjectContent",
  {
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "projects_contents",
    timestamps: false,
  }
);

module.exports = ProjectContent;