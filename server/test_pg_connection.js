require("dotenv").config();
const { Client } = require("pg");

async function testConnection() {
  const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/login2026";
  console.log("Testing PostgreSQL Connection for:", dbUrl);

  const client = new Client({ connectionString: dbUrl });

  try {
    await client.connect();
    console.log("✓ SUCCESS: PostgreSQL connected successfully!");
    const res = await client.query("SELECT current_user, current_database(), version()");
    console.log("DB User:", res.rows[0].current_user);
    console.log("DB Name:", res.rows[0].current_database);
    console.log("PostgreSQL Version:", res.rows[0].version);
    await client.end();
  } catch (err) {
    console.error("✗ ERROR Connecting to PostgreSQL:", err.message);
    console.log("\nFixing instructions:");
    console.log("1. Open server/.env");
    console.log("2. Set DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/login2026");
    console.log("3. Run node server/seed_events.js and node server/seed_users.js to populate the tables!");
  }
}

testConnection();
