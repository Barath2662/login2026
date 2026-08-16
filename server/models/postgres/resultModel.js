const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const eventModel = require("./eventModel");
const userModel = require("./userModel");

const resultModel = sequelize.define(
  "event_results",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: eventModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "SET NULL",
    },

    runner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "SET NULL",
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "event_results",
    timestamps: true,
  }
);

module.exports = resultModel;
