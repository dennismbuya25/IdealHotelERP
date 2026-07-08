const bcrypt = require('bcryptjs');
const pool = require('./config/database.cjs');
require('dotenv').config();

async function updateAdminPassword() {
  const client = await pool.connect();
  try {
    console.log('🔄 Updating admin password...');
    
    // Hash the password
    const passwordHash = await bcrypt.hash('myGod', 10);
    console.log('🔐 Password hashed');
    
    // Update admin user
    const result = await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2 RETURNING username, name',
      [passwordHash, 'admin']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Admin password updated successfully');
      console.log('📋 User:', result.rows[0]);
      console.log('🔑 Login credentials:');
      console.log('   Username: admin');
      console.log('   Password: myGod');
    } else {
      console.log('❌ Admin user not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

updateAdminPassword();
