const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");
const userModel = require("./userModel");
const teamModel = require("./teamModel");

const teamInvitationModel = sequelize.define(
  "team_invitations",
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

    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: userModel,
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
      type: DataTypes.ENUM("pending", "accepted", "declined", "expired"),
      allowNull: false,
      defaultValue: "pending",
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "team_invitations",
    timestamps: true,
  }
);

module.exports = teamInvitationModel;
