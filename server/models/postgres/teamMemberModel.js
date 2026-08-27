const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const teamModel = require("./teamModel");
const userModel = require("./userModel");

const teamMemberModel = sequelize.define(
  "team_members",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: teamModel,
        key: "id",
      },
      onDelete: "CASCADE",
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

    role: {
      type: DataTypes.ENUM("leader", "member"),
      allowNull: false,
      defaultValue: "member",
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "left"),
      allowNull: false,
      defaultValue: "accepted",
    },
  },
  {
    tableName: "team_members",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["team_id", "student_id"],
      },
    ],
  }
);

module.exports = teamMemberModel;
