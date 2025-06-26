const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const VolunteerContent = sequelize.define(
  "VolunteerContent",
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
    tableName: "volunteer_contents",
    timestamps: false,
  }
);

module.exports = VolunteerContent;
