const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'idealhoteldb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('🔗 Connected to database:', process.env.DB_NAME);
    
    // Read the first migration file
    const migration1 = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20250720232312_snowy_lodge.sql'),
      'utf8'
    );
    
    // Read the second migration file
    const migration2 = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20250722003717_dark_wood.sql'),
      'utf8'
    );
    
    console.log('📄 Executing migration 1: 20250720232312_snowy_lodge.sql');
    await client.query(migration1);
    console.log('✅ Migration 1 completed');
    
    // Migration 2 is a diff file that was already applied to migration 1
    console.log('📄 Migration 2 is a diff patch (already applied to migration 1)');
    
    console.log('\n✨ All migrations executed successfully!');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tables created:');
    result.rows.forEach(row => {
      console.log(`  • ${row.table_name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
