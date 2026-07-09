const pool = require('../server/config/database.cjs');

(async () => {
  try {
    const result = await pool.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name IN ('guests','bookings','users','rooms','staff','inventory_items','kitchen_orders','invoices','expenses','integrations','communications')
      ORDER BY table_name, ordinal_position
    `);
    result.rows.forEach(row => {
      console.log(`${row.table_name}.${row.column_name} (${row.data_type})`);
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
