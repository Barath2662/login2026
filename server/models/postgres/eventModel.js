const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const eventModel = sequelize.define(
  "events",
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

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    venue: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    max_participants: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("draft", "open", "closed", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "draft",
    },
  },
  {
    tableName: "events",
    timestamps: true,
  }
);

module.exports = eventModel;
