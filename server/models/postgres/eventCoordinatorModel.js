const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const eventModel = require("./eventModel");
const userModel = require("./userModel");

const eventCoordinatorModel = sequelize.define(
  "event_coordinators",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: eventModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "event_coordinators",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["event_id", "user_id"],
      },
    ],
  }
);

module.exports = eventCoordinatorModel;
