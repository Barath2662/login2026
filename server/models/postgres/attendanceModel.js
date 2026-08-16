const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");
const eventModel = require("./eventModel");

const attendanceModel = sequelize.define(
  "attendance",
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
      type: DataTypes.ENUM("present", "absent", "not_marked"),
      allowNull: false,
      defaultValue: "not_marked",
    },

    marked_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "SET NULL",
    },

    marked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "attendance",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["student_id", "event_id"],
      },
    ],
  }
);

module.exports = attendanceModel;
