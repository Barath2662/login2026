const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const otpModel = sequelize.define(
  "otps",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "otps",
    timestamps: true,
  }
);

module.exports = otpModel;
