const pool = require('../server/config/database.cjs');

(async () => {
  try {
    await pool.query("ALTER TABLE guests ADD COLUMN IF NOT EXISTS email VARCHAR(100)");
    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS guest_name TEXT");
    await pool.query("ALTER TABLE invoices ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::JSONB");
    console.log('Schema updated successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
