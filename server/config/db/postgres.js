const { Sequelize } = require("sequelize");
const path = require("path");
require("pg"); // Force Vercel bundler to include 'pg' module for Sequelize

let sequelize;

function createPostgresInstance() {
  const dbConn = process.env.DATABASE_URL || process.env.DBCONN;

  if (!dbConn) {
    throw new Error(
      "DATABASE_URL is not set. Provide a PostgreSQL connection string for Docker or local development."
    );
  }

  return new Sequelize(dbConn, {
    dialect: "postgres",
    logging: false,
    dialectOptions: process.env.NODE_ENV === "production" && process.env.DATABASE_URL?.includes("localhost") === false ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  });
}

function createSqliteInstance() {
  const dbPath = process.env.SQLITE_PATH || path.resolve(__dirname, "../../login.sqlite");
  return new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false,
  });
}

const forceSqlite = process.env.USE_SQLITE === "true";

sequelize = forceSqlite ? createSqliteInstance() : createPostgresInstance();

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully using ${sequelize.getDialect()}`);
  } catch (error) {
    if (forceSqlite) {
      throw error;
    }

    console.error("PostgreSQL connection failed. Check DATABASE_URL and container networking.");
    throw error;
  }
};

module.exports = { connectPostgres, sequelize };
