const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");

const teamModel = sequelize.define(
  "teams",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    member_emails: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "[]",
    },
  },
  {
    tableName: "teams",
    timestamps: true,
  }
);

module.exports = teamModel;
