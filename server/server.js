const path = require('path');
const bcrypt = require('bcryptjs');

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
const userModel = require("./models/postgres/userModel");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectPostgres();

    // Sync database models first to ensure all default tables and enum types exist
    await sequelize.sync({ logging: false });

    // Apply incremental schema updates safely
    try {
      await sequelize.query("ALTER TYPE \"enum_users_user_type\" ADD VALUE IF NOT EXISTS 'STAFF';");
    } catch (enumErr) {
      console.warn("enum_users_user_type update warning:", enumErr.message);
    }

    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "is_online" BOOLEAN NOT NULL DEFAULT FALSE;');
    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "coordinator_name" VARCHAR(255);');
    await sequelize.query('ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "coordinator_phone" VARCHAR(255);');
    await sequelize.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "accommodation_required" BOOLEAN NOT NULL DEFAULT FALSE;');

    // Payment migrations
    await sequelize.query('ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "payment_date" VARCHAR(255);');
    await sequelize.query('ALTER TABLE "payments" ADD COLUMN IF NOT EXISTS "payment_method" VARCHAR(255) DEFAULT \'UPI\';');

    // LOGIN ID system migrations
    await sequelize.query('ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "login_id" VARCHAR(20) UNIQUE;');

    // Team-Event association migrations
    await sequelize.query('ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "event_id" INTEGER REFERENCES "events"("id") ON DELETE CASCADE;');
    await sequelize.query('ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "status" VARCHAR(20) DEFAULT \'forming\';');

    // Team member role migration
    await sequelize.query('ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "role" VARCHAR(20) DEFAULT \'member\';');

    // Team invitation status enum (safe creation)
    try {
      await sequelize.query("CREATE TYPE \"enum_team_invitations_status\" AS ENUM('pending', 'accepted', 'declined', 'expired');");
    } catch (_) { /* type may already exist */ }

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

    // --- SEED ACCOUNTS ---
    try {
      const { Op } = require('sequelize');
      const hashedAdminPw  = await bcrypt.hash('l0gin26', 10);
      const hashedCoordPw  = await bcrypt.hash('l0gin26', 10);

      // Admin — login with: ADMIN / l0gin26
      const adminUser = await userModel.findOne({
        where: { [Op.or]: [{ login_id: 'ADMIN' }, { email: '25mx336@psgtech.ac.in' }] },
      });
      if (!adminUser) {
        await userModel.create({
          name: 'Super Admin',
          email: '25mx336@psgtech.ac.in',
          password: hashedAdminPw,
          role: 'super_admin',
          user_type: 'STAFF',
          login_id: 'ADMIN',
          accommodation_required: false,
        });
        console.log('Seeded Super Admin (login_id: ADMIN, password: l0gin26)');
      } else {
        await adminUser.update({ login_id: 'ADMIN', password: hashedAdminPw });
        console.log('Updated Super Admin seed → login_id: ADMIN, password: l0gin26');
      }

      // Registration Coordinator — login with: COORD / l0gin26
      const coordUser = await userModel.findOne({
        where: { [Op.or]: [{ login_id: 'COORD' }, { email: '25mx331@psgtech.ac.in' }] },
      });
      if (!coordUser) {
        await userModel.create({
          name: 'Registration Coordinator',
          email: '25mx331@psgtech.ac.in',
          password: hashedCoordPw,
          role: 'event_coordinator',
          user_type: 'STAFF',
          login_id: 'COORD',
          accommodation_required: false,
        });
        console.log('Seeded Coordinator (login_id: COORD, password: l0gin26)');
      } else {
        await coordUser.update({ login_id: 'COORD', password: hashedCoordPw });
        console.log('Updated Coordinator seed → login_id: COORD, password: l0gin26');
      }
    } catch (seedErr) {
      console.warn('Account seeding failed:', seedErr.message);
    }
    // ----------------------

    app.listen(PORT, () => {
      console.log(`LOGIN 2026 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
