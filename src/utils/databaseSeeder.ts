import { Category, Subcategory, User, Worker, Order, Message, Advertisement } from '../models';
import bcrypt from 'bcryptjs';
import { sequelize } from '../database';
import mongoose from 'mongoose';

export class DatabaseSeeder {
  /**
   * Test database connections
   */
  static async testConnections(): Promise<void> {
    try {
      console.log('🔍 Testing database connections...');
      
      // Test MySQL connection
      await sequelize.authenticate();
      console.log('✅ MySQL connection established successfully');
      
      // Test MongoDB connection
      if (mongoose.connection.readyState === 1) {
        console.log('✅ MongoDB connection established successfully');
      } else {
        console.log('⚠️ MongoDB connection not established');
      }
      
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      throw error;
    }
  }

  /**
   * Seed all data
   */
  static async seedAll(): Promise<void> {
    try {
      console.log('🌱 Starting database seeding...');
      
      // Test connections first
      await this.testConnections();
      
      await this.seedCategories();
      await this.seedSubcategories();
      await this.seedUsers();
      await this.seedWorkers();
      await this.seedOrders();
      await this.seedMessages();
      await this.seedAdvertisements();
      
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Instance method for seeding
   */
  async seedAll(): Promise<void> {
    return DatabaseSeeder.seedAll();
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
   * Seed workers (MongoDB)
   */
  private static async seedWorkers(): Promise<void> {
    const workers = [
      {
        name: 'Marko Petrović',
        email: 'marko.elektricar@example.com',
        phone: '+381 60 123 4567',
        category: 'Električne Instalacije',
        skills: ['Instalacije', 'Rasveta', 'Popravke'],
        rating: 4.8,
        completedJobs: 156,
        hourlyRate: 25,
        status: 'active',
        verified: true,
        location: 'Beograd',
        coordinates: { lat: 44.7866, lng: 20.4489 }
      },
      {
        name: 'Ana Jovanović',
        email: 'ana.ciscenje@example.com',
        phone: '+381 60 987 6543',
        category: 'Čišćenje',
        skills: ['Generalno čišćenje', 'Dubinsko čišćenje', 'Pranje prozora'],
        rating: 4.9,
        completedJobs: 89,
        hourlyRate: 18,
        status: 'active',
        verified: true,
        location: 'Novi Sad',
        coordinates: { lat: 45.2551, lng: 19.8452 }
      },
      {
        name: 'Milan Đorđević',
        email: 'milan.stolar@example.com',
        phone: '+381 60 555 1234',
        category: 'Stolarija',
        skills: ['Namještaj', 'Vrata', 'Prozori'],
        rating: 4.7,
        completedJobs: 78,
        hourlyRate: 30,
        status: 'active',
        verified: true,
        location: 'Niš',
        coordinates: { lat: 43.3247, lng: 21.9033 }
      },
      {
        name: 'Stefan Nikolić',
        email: 'stefan.vodo@example.com',
        phone: '+381 60 777 8888',
        category: 'Vodoinstalaterske Usluge',
        skills: ['Popravke', 'Instalacije', 'Sanitarije'],
        rating: 4.6,
        completedJobs: 92,
        hourlyRate: 22,
        status: 'active',
        verified: true,
        location: 'Kragujevac',
        coordinates: { lat: 44.0165, lng: 20.9204 }
      },
      {
        name: 'Jelena Marković',
        email: 'jelena.klima@example.com',
        phone: '+381 60 999 0000',
        category: 'Klima Uređaji',
        skills: ['Instalacija', 'Servis', 'Popravke'],
        rating: 4.8,
        completedJobs: 67,
        hourlyRate: 35,
        status: 'active',
        verified: true,
        location: 'Subotica',
        coordinates: { lat: 46.1009, lng: 19.6676 }
      }
    ];

    for (const workerData of workers) {
      const existingWorker = await Worker.findOne({ email: workerData.email });
      if (!existingWorker) {
        await Worker.create(workerData);
        console.log(`✅ Created worker: ${workerData.name}`);
      } else {
        console.log(`⏭️  Worker already exists: ${workerData.name}`);
      }
    }
  }

  /**
   * Seed orders (MongoDB)
   */
  private static async seedOrders(): Promise<void> {
    const orders = [
      {
        orderNumber: 'ORD-001',
        customerId: 'customer1',
        workerId: 'worker1',
        category: 'Električne Instalacije',
        title: 'Popravka rasvete u kuhinji',
        description: 'Potrebna je popravka rasvete u kuhinji. Problem sa prekidačem.',
        status: 'completed',
        totalAmount: 85.00,
        commission: 8.50,
        netAmount: 76.50,
        scheduledDate: new Date('2024-01-20'),
        completedDate: new Date('2024-01-20'),
        location: 'Beograd',
        coordinates: { lat: 44.7866, lng: 20.4489 }
      },
      {
        orderNumber: 'ORD-002',
        customerId: 'customer2',
        workerId: 'worker2',
        category: 'Čišćenje',
        title: 'Generalno čišćenje stana',
        description: 'Potrebno je generalno čišćenje 3-sobnog stana.',
        status: 'in_progress',
        totalAmount: 120.00,
        commission: 12.00,
        netAmount: 108.00,
        scheduledDate: new Date('2024-01-21'),
        location: 'Novi Sad',
        coordinates: { lat: 45.2551, lng: 19.8452 }
      },
      {
        orderNumber: 'ORD-003',
        customerId: 'customer3',
        workerId: 'worker3',
        category: 'Stolarija',
        title: 'Popravka kuhinjskih ormarića',
        description: 'Potrebna je popravka kuhinjskih ormarića - zameniti šarke.',
        status: 'pending',
        totalAmount: 65.00,
        commission: 6.50,
        netAmount: 58.50,
        scheduledDate: new Date('2024-01-22'),
        location: 'Niš',
        coordinates: { lat: 43.3247, lng: 21.9033 }
      }
    ];

    for (const orderData of orders) {
      const existingOrder = await Order.findOne({ orderNumber: orderData.orderNumber });
      if (!existingOrder) {
        await Order.create(orderData);
        console.log(`✅ Created order: ${orderData.orderNumber}`);
      } else {
        console.log(`⏭️  Order already exists: ${orderData.orderNumber}`);
      }
    }
  }

  /**
   * Seed messages (MongoDB)
   */
  private static async seedMessages(): Promise<void> {
    const messages = [
      {
        orderId: 'order1',
        senderId: 'customer1',
        receiverId: 'worker1',
        message: 'Hvala na brzom odgovoru! Kada možete da dođete?',
        timestamp: new Date('2024-01-20T10:30:00Z'),
        isRead: true
      },
      {
        orderId: 'order1',
        senderId: 'worker1',
        receiverId: 'customer1',
        message: 'Mogu da dođem sutra u 14:00. Da li vam odgovara?',
        timestamp: new Date('2024-01-20T10:35:00Z'),
        isRead: true
      },
      {
        orderId: 'order2',
        senderId: 'customer2',
        receiverId: 'worker2',
        message: 'Da li možete da dođete u subotu?',
        timestamp: new Date('2024-01-21T09:15:00Z'),
        isRead: false
      }
    ];

    for (const messageData of messages) {
      await Message.create(messageData);
      console.log(`✅ Created message for order: ${messageData.orderId}`);
    }
  }

  /**
   * Seed advertisements (MongoDB)
   */
  private static async seedAdvertisements(): Promise<void> {
    const advertisements = [
      {
        title: 'Specijalna ponuda za čišćenje',
        description: '20% popusta na sve usluge čišćenja u januaru!',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
        status: 'active',
        position: 'homepage-top',
        priority: 1,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        targetUrl: '/categories/cleaning',
        clicks: 0,
        impressions: 0
      },
      {
        title: 'Novi radnici u vašem gradu',
        description: 'Pridružite se našoj platformi i zaradite dodatni novac!',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
        status: 'active',
        position: 'homepage-sidebar',
        priority: 2,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        targetUrl: '/register-worker',
        clicks: 0,
        impressions: 0
      }
    ];

    for (const adData of advertisements) {
      const existingAd = await Advertisement.findOne({ title: adData.title });
      if (!existingAd) {
        await Advertisement.create(adData);
        console.log(`✅ Created advertisement: ${adData.title}`);
      } else {
        console.log(`⏭️  Advertisement already exists: ${adData.title}`);
      }
    }
  }

  /**
   * Clear all data (dangerous - use only in development)
   */
  static async clearAll(): Promise<void> {
    try {
      console.log('🗑️  Clearing all data...');
      
      // Clear MySQL data
      await Subcategory.destroy({ where: {} });
      await Category.destroy({ where: {} });
      await User.destroy({ where: {} });
      
      // Clear MongoDB data
      await Worker.deleteMany({});
      await Order.deleteMany({});
      await Message.deleteMany({});
      await Advertisement.deleteMany({});
      
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
