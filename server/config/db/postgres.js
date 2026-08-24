const { Sequelize } = require("sequelize");
const path = require("path");

let sequelize;

function createPostgresInstance() {
  const dbConn = process.env.DATABASE_URL || process.env.DBCONN || "postgresql://postgres:postgres@localhost:5432/login2026";
  return new Sequelize(dbConn, {
    dialect: "postgres",
    logging: false,
    dialectOptions: process.env.NODE_ENV === "production" ? {
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

if (forceSqlite) {
  sequelize = createSqliteInstance();
} else {
  sequelize = createPostgresInstance();
}

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully using ${sequelize.getDialect()}`);
  } catch (error) {
    if (!forceSqlite) {
      console.warn("PostgreSQL server connection unauthenticated or inactive. Auto-reconfiguring to local database engine...");
      const newSequelize = createSqliteInstance();
      sequelize = newSequelize;
      await sequelize.authenticate();
      console.log(`Database connected successfully using fallback: ${sequelize.getDialect()}`);
    } else {
      throw error;
    }
  }
};

module.exports = { connectPostgres, sequelize };
