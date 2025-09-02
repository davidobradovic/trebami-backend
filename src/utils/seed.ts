import { DatabaseSeeder } from './databaseSeeder';
import { testConnections } from '../database';

async function main() {
  try {
    console.log('🚀 Starting database seeder...');
    
    // Test database connections first
    await testConnections();
    
    // Seed the database
    await DatabaseSeeder.seedAll();
    
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeder
main();
