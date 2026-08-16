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

    status: {
      type: DataTypes.ENUM("active", "left"),
      allowNull: false,
      defaultValue: "active",
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
