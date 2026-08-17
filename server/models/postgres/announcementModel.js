const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const announcementModel = sequelize.define(
  "announcements",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("normal", "high", "urgent"),
      allowNull: false,
      defaultValue: "normal",
    },
    active_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    active_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "announcements",
    timestamps: true,
  }
);

module.exports = announcementModel;
