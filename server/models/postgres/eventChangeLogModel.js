const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const eventChangeLogModel = sequelize.define(
  "event_change_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fields_changed: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "event_change_logs",
    timestamps: true,
  }
);

module.exports = eventChangeLogModel;
