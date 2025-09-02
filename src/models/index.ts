// MySQL Models (Sequelize)
import { sequelize } from '../database';
import { Category } from './Category';
import { Subcategory } from './Subcategory';
import { User } from './User';

// MongoDB Models (Mongoose)
import Worker from './Worker';
import Order from './Order';
import Message from './Message';
import Advertisement from './Advertisement';

// Setup MySQL relationships
Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Export all models
export {
  // MySQL Models
  sequelize,
  Category,
  Subcategory,
  User,
  
  // MongoDB Models
  Worker,
  Order,
  Message,
  Advertisement
};

export default {
  // MySQL Models
  sequelize,
  Category,
  Subcategory,
  User,
  
  // MongoDB Models
  Worker,
  Order,
  Message,
  Advertisement
};
