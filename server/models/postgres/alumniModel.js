const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const Alumni = sequelize.define(
  "alumni",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING, allowNull: true },
    batch_year: { type: DataTypes.STRING, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: true },
    place: { type: DataTypes.STRING, allowNull: true },
    current_organization: { type: DataTypes.STRING, allowNull: true },
    accommodation_required: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: "alumni", timestamps: true }
);

module.exports = Alumni;
