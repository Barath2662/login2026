const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");
const teamModel = require("./teamModel");

const teamRequestModel = sequelize.define(
  "team_requests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "CASCADE",
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

    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "team_requests",
    timestamps: true,
  }
);



module.exports = teamRequestModel;
