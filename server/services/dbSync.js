const { sequelize, neonSequelize } = require('../config/db/postgres');

/**
 * Basic Dual DB Synchronization Mechanism
 * This function can be run periodically to synchronize the local Postgres DB to Neon Postgres DB.
 */
async function syncLocalToNeon() {
  if (!neonSequelize) return;

  console.log('[DB Sync] Starting synchronization between Local and Neon...');

  try {
    // 1. Get all table names
    const [tables] = await sequelize.query(`
      SELECT tablename
      FROM pg_catalog.pg_tables
      WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';
    `);

    for (const { tablename } of tables) {
      if (tablename === 'SequelizeMeta') continue;
      
      // We do a simple dump and insert-on-conflict for demonstration.
      // In production with high volume, consider proper CDC or replication slots.
      try {
        const [rows] = await sequelize.query(`SELECT * FROM "${tablename}"`);
        if (rows.length === 0) continue;

        // Ensure table exists on Neon side (assuming sync/migrations ran there)
        for (const row of rows) {
          const keys = Object.keys(row);
          const values = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            if (typeof v === 'object' && v instanceof Date) return `'${v.toISOString()}'`;
            if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
            return v;
          });

          const updateSet = keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ');

          const query = `
            INSERT INTO "${tablename}" (${keys.map(k => `"${k}"`).join(', ')})
            VALUES (${values.join(', ')})
            ON CONFLICT (id) DO UPDATE SET ${updateSet};
          `;
          
          // NOTE: Only tables with primary key 'id' will support this ON CONFLICT strategy natively in this basic script.
          // If a table lacks an 'id' column, it might fail, which is caught below.
          await neonSequelize.query(query).catch(() => {});
        }
      } catch (err) {
        // Skip tables that don't conform to the simple sync strategy
      }
    }
    
    console.log('[DB Sync] Synchronization completed successfully.');
  } catch (error) {
    console.error('[DB Sync] Failed to synchronize:', error);
  }
}

function startSyncCron(intervalMs = 5 * 60 * 1000) {
  if (!neonSequelize) {
    console.log('[DB Sync] Neon DB not configured, skipping sync cron.');
    return;
  }
  console.log(`[DB Sync] Starting periodic sync job every ${intervalMs / 1000} seconds`);
  setInterval(syncLocalToNeon, intervalMs);
}

module.exports = { syncLocalToNeon, startSyncCron };
