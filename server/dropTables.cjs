const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'idealhoteldb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function dropAllTables() {
  const client = await pool.connect();
  try {
    console.log('🗑️  Dropping all existing tables...');
    
    // Drop all tables in the public schema
    await client.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);
    
    console.log('✅ All tables dropped');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error dropping tables:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

dropAllTables();
