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

    await sequelize.query("ALTER TYPE \"enum_users_user_type\" ADD VALUE IF NOT EXISTS 'STAFF';");
    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_online" BOOLEAN NOT NULL DEFAULT FALSE;');
    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "coordinator_name" VARCHAR(255);');
    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "coordinator_phone" VARCHAR(255);');
    await sequelize.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "accommodation_required" BOOLEAN NOT NULL DEFAULT FALSE;');

    await sequelize.sync({ logging: false });

    try {
      const queryInterface = sequelize.getQueryInterface();
      const teamsTable = await queryInterface.describeTable('teams').catch(() => null);
      if (teamsTable && !Object.prototype.hasOwnProperty.call(teamsTable, 'member_emails')) {
        await queryInterface.addColumn('teams', 'member_emails', {
          type: sequelize.Sequelize.DataTypes.TEXT,
          allowNull: true,
          defaultValue: '[]',
        });
      }
    } catch (columnError) {
      console.warn('Member email column bootstrap warning:', columnError.message);
    }

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
