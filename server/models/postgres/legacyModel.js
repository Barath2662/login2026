const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db/postgres");

const legacyEditionModel = sequelize.define(
  "legacy_editions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    edition_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cover_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "legacy_editions",
    timestamps: true,
  }
);

const legacyItemModel = sequelize.define(
  "legacy_items",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    edition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: legacyEditionModel,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM("PHOTO", "VIDEO"),
      allowNull: false,
      defaultValue: "PHOTO",
    },
    storage_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    credit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    consent_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "legacy_items",
    timestamps: true,
  }
);

legacyEditionModel.hasMany(legacyItemModel, { foreignKey: "edition_id", as: "items" });
legacyItemModel.belongsTo(legacyEditionModel, { foreignKey: "edition_id" });

module.exports = {
  LegacyEdition: legacyEditionModel,
  LegacyItem: legacyItemModel,
};
