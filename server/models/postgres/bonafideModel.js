const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");

const bonafideModel = sequelize.define(
  "bonafides",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("uploaded", "under_review", "verified", "rejected"),
      allowNull: false,
      defaultValue: "uploaded",
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "bonafides",
    timestamps: true,
  }
);

module.exports = bonafideModel;
