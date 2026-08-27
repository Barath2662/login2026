const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");
const eventModel = require("./eventModel");

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

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: eventModel,
        key: "id",
      },
      onDelete: "CASCADE",
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

    status: {
      type: DataTypes.ENUM("forming", "registered", "disbanded"),
      allowNull: false,
      defaultValue: "forming",
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
