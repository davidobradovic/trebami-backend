import { DatabaseSeeder } from './databaseSeeder';

async function seed() {
  try {
    console.log('🚀 Starting database seeder...');
    
    // Initialize database seeder
    const seeder = new DatabaseSeeder();
    
    // Seed all data
    await seeder.seedAll();
    
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

seed();