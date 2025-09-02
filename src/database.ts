import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MySQL Configuration (for existing data - categories, subcategories, users)
export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'workerapp',
  process.env.MYSQL_USERNAME || 'newuser',
  process.env.MYSQL_PASSWORD || 'newpassword',
  {
    host: process.env.MYSQL_HOST || '185.239.237.189',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// MongoDB Configuration (for new features)
export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://dadodado:Tesla1312.@trebamibackend.rzwn05m.mongodb.net/?retryWrites=true&w=majority&appName=trebamibackend';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test database connections
export const testConnections = async (): Promise<void> => {
  try {
    // Test MySQL
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully');
    
    // Test MongoDB
    await connectMongoDB();
    
    console.log('✅ All database connections successful');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

export default { sequelize, connectMongoDB, testConnections };
