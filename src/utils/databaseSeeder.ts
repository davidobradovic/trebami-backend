import { Category, Subcategory, User } from '../models';
import bcrypt from 'bcryptjs';

export class DatabaseSeeder {
  /**
   * Seed all data
   */
  static async seedAll(): Promise<void> {
    try {
      console.log('🌱 Starting database seeding...');
      
      await this.seedCategories();
      await this.seedSubcategories();
      await this.seedUsers();
      
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Seed categories
   */
  private static async seedCategories(): Promise<void> {
    const categories = [
      {
        title: 'Čišćenje',
        icon: '🧹',
        description: 'Usluge čišćenja domova, kancelarija i drugih prostora',
        color: '#4CAF50',
        isActive: true
      },
      {
        title: 'Popravka',
        icon: '🔧',
        description: 'Popravka kućanskih aparata, elektronike i drugih predmeta',
        color: '#2196F3',
        isActive: true
      },
      {
        title: 'Gradnja',
        icon: '🏗️',
        description: 'Gradnja, renoviranje i održavanje objekata',
        color: '#FF9800',
        isActive: true
      },
      {
        title: 'Transport',
        icon: '🚚',
        description: 'Transport i prevoz robe i ljudi',
        color: '#9C27B0',
        isActive: true
      },
      {
        title: 'IT Podrška',
        icon: '💻',
        description: 'IT usluge, održavanje računara i mreža',
        color: '#607D8B',
        isActive: true
      },
      {
        title: 'Kozmetika',
        icon: '💄',
        description: 'Kozmetičke usluge i tretmani',
        color: '#E91E63',
        isActive: true
      },
      {
        title: 'Edukacija',
        icon: '📚',
        description: 'Nastava, obuka i edukativne usluge',
        color: '#795548',
        isActive: true
      },
      {
        title: 'Zdravlje',
        icon: '🏥',
        description: 'Zdravstvene usluge i terapije',
        color: '#F44336',
        isActive: true
      }
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ where: { title: categoryData.title } });
      if (!existingCategory) {
        await Category.create({
          ...categoryData,
          createdAt: new Date(),
          createdBy: 1
        });
        console.log(`✅ Created category: ${categoryData.title}`);
      } else {
        console.log(`⏭️  Category already exists: ${categoryData.title}`);
      }
    }
  }

  /**
   * Seed subcategories
   */
  private static async seedSubcategories(): Promise<void> {
    const subcategories = [
      // Čišćenje
      { title: 'Čišćenje domova', categoryId: 1, description: 'Profesionalno čišćenje domova i stanova' },
      { title: 'Čišćenje kancelarija', categoryId: 1, description: 'Čišćenje poslovnih prostora' },
      { title: 'Čišćenje nakon renoviranja', categoryId: 1, description: 'Čišćenje nakon građevinskih radova' },
      { title: 'Čišćenje tepiha', categoryId: 1, description: 'Profesionalno čišćenje tepiha' },
      
      // Popravka
      { title: 'Popravka kućanskih aparata', categoryId: 2, description: 'Popravka frižidera, veš mašina, itd.' },
      { title: 'Popravka elektronike', categoryId: 2, description: 'Popravka TV-a, računara, telefona' },
      { title: 'Popravka nameštaja', categoryId: 2, description: 'Popravka i restauracija nameštaja' },
      { title: 'Popravka automobila', categoryId: 2, description: 'Osnovne popravke automobila' },
      
      // Gradnja
      { title: 'Renoviranje kupatila', categoryId: 3, description: 'Kompletno renoviranje kupatila' },
      { title: 'Renoviranje kuhinje', categoryId: 3, description: 'Renoviranje i modernizacija kuhinje' },
      { title: 'Postavljanje pločica', categoryId: 3, description: 'Postavljanje keramičkih pločica' },
      { title: 'Farbanje i tapetiranje', categoryId: 3, description: 'Farbanje zidova i postavljanje tapeta' },
      
      // Transport
      { title: 'Selidbe', categoryId: 4, description: 'Profesionalne selidbe domova i kancelarija' },
      { title: 'Prevoz nameštaja', categoryId: 4, description: 'Prevoz i montaža nameštaja' },
      { title: 'Prevoz robe', categoryId: 4, description: 'Prevoz različite robe i opreme' },
      
      // IT Podrška
      { title: 'Održavanje računara', categoryId: 5, description: 'Održavanje i popravka računara' },
      { title: 'Mrežna infrastruktura', categoryId: 5, description: 'Postavljanje i održavanje mreža' },
      { title: 'Web dizajn', categoryId: 5, description: 'Kreiranje web sajtova i aplikacija' },
      
      // Kozmetika
      { title: 'Frizerske usluge', categoryId: 6, description: 'Šišanje, bojanje, frizure' },
      { title: 'Manikir i pedikir', categoryId: 6, description: 'Profesionalni manikir i pedikir' },
      { title: 'Kozmetički tretmani', categoryId: 6, description: 'Različiti kozmetički tretmani' },
      
      // Edukacija
      { title: 'Nastava jezika', categoryId: 7, description: 'Individualna i grupna nastava jezika' },
      { title: 'Matematika i fizika', categoryId: 7, description: 'Nastava matematike i fizike' },
      { title: 'Muzička nastava', categoryId: 7, description: 'Nastava muzičkih instrumenata' },
      
      // Zdravlje
      { title: 'Fizioterapija', categoryId: 8, description: 'Fizioterapijski tretmani' },
      { title: 'Masaze', categoryId: 8, description: 'Različite vrste masaža' },
      { title: 'Nutricionističko savetovanje', categoryId: 8, description: 'Savetovanje o ishrani' }
    ];

    for (const subcategoryData of subcategories) {
      const existingSubcategory = await Subcategory.findOne({ 
        where: { title: subcategoryData.title, categoryId: subcategoryData.categoryId } 
      });
      if (!existingSubcategory) {
        await Subcategory.create({
          ...subcategoryData,
          isActive: true,
          createdAt: new Date(),
          createdBy: 1
        });
        console.log(`✅ Created subcategory: ${subcategoryData.title}`);
      } else {
        console.log(`⏭️  Subcategory already exists: ${subcategoryData.title}`);
      }
    }
  }

  /**
   * Seed users
   */
  private static async seedUsers(): Promise<void> {
    const users = [
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        phoneNumber: '+381601234567',
        isActive: true
      },
      {
        fullName: 'Test Worker',
        email: 'worker@example.com',
        password: 'worker123',
        role: 'worker',
        phoneNumber: '+381601234568',
        isActive: true
      },
      {
        fullName: 'Test Customer',
        email: 'customer@example.com',
        password: 'customer123',
        role: 'user',
        phoneNumber: '+381601234569',
        isActive: true
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
          ...userData,
          password: hashedPassword,
          role: userData.role as 'user' | 'worker' | 'admin',
          createdAt: new Date()
        });
        console.log(`✅ Created user: ${userData.fullName} (${userData.role})`);
      } else {
        console.log(`⏭️  User already exists: ${userData.fullName}`);
      }
    }
  }

  /**
   * Clear all data (dangerous - use only in development)
   */
  static async clearAll(): Promise<void> {
    try {
      console.log('🗑️  Clearing all data...');
      
      await Subcategory.destroy({ where: {} });
      await Category.destroy({ where: {} });
      await User.destroy({ where: {} });
      
      console.log('✅ All data cleared successfully!');
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      throw error;
    }
  }

  /**
   * Reset database (clear and reseed)
   */
  static async reset(): Promise<void> {
    try {
      console.log('🔄 Resetting database...');
      await this.clearAll();
      await this.seedAll();
      console.log('✅ Database reset completed successfully!');
    } catch (error) {
      console.error('❌ Database reset failed:', error);
      throw error;
    }
  }
}
