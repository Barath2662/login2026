const path = require('path');

const repoEnvPath = path.resolve(__dirname, '../.env');
const serverEnvPath = path.resolve(__dirname, '.env');
require('dotenv').config({ path: repoEnvPath });
require('dotenv').config({ path: serverEnvPath });

process.env.JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_login_2026';
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'super_secret_session_key_login_2026';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = require("./app");
const { connectPostgres, sequelize } = require("./config/db/postgres");
require("./models/postgres");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectPostgres();

    // Ensure the schema exists before API traffic hits the app.
    await sequelize.sync({ alter: true, logging: false });
    console.log("Database schema synchronized");

    app.listen(PORT, () => {
      console.log(`LOGIN 2026 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
