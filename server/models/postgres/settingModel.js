const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const settingModel = sequelize.define(
  "settings",
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "settings",
    timestamps: true,
  }
);

module.exports = settingModel;
