const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const emailLogModel = sequelize.define(
  "email_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    template: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("QUEUED", "SENT", "FAILED"),
      allowNull: false,
      defaultValue: "SENT",
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    related_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "email_logs",
    timestamps: true,
  }
);

module.exports = emailLogModel;
