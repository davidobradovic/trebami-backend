const { User } = require('./dist/models');
const { sequelize } = require('./dist/database');

async function fixUserRoles() {
  try {
    console.log('🔧 Fixing user roles...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Find users with null roles
    const usersWithNullRoles = await User.findAll({
      where: {
        role: null
      }
    });
    
    console.log(`Found ${usersWithNullRoles.length} users with null roles`);
    
    // Update each user to have 'user' role by default
    for (const user of usersWithNullRoles) {
      await user.update({ role: 'user' });
      console.log(`✅ Updated user ${user.id} (${user.email}) role to 'user'`);
    }
    
    // Verify the fix
    const allUsers = await User.findAll({
      attributes: ['id', 'email', 'role', 'isActive']
    });
    
    console.log('\n📊 Current users in database:');
    allUsers.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Active: ${user.isActive}`);
    });
    
    console.log('\n✅ User roles fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
  } finally {
    await sequelize.close();
  }
}

fixUserRoles();
