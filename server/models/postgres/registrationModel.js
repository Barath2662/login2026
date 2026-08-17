const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");
const eventModel = require("./eventModel");

const registrationModel = sequelize.define(
  "registrations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "CASCADE",
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

    status: {
      type: DataTypes.ENUM("registered", "cancelled", "attended", "disqualified"),
      allowNull: false,
      defaultValue: "registered",
    },
  },
  {
    tableName: "registrations",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["student_id", "event_id"],
      },
    ],
  }
);

module.exports = registrationModel;
