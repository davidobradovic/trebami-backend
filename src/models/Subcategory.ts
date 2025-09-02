import { sequelize } from '../database';
import { Model, DataTypes } from 'sequelize';
import { Category } from './Category';

export interface SubcategoryAttributes {
  id?: number;
  categoryId: number;
  title: string;
  createdAt?: Date;
  createdBy?: number;
  isActive?: boolean;
  description?: string;
  icon?: string;
}

export class Subcategory extends Model<SubcategoryAttributes> implements SubcategoryAttributes {
  public id!: number;
  public categoryId!: number;
  public title!: string;
  public createdAt?: Date;
  public createdBy?: number;
  public isActive?: boolean;
  public description?: string;
  public icon?: string;
}

Subcategory.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  categoryId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  title: { 
    type: DataTypes.STRING(45), 
    allowNull: false 
  },
  createdAt: { 
    type: DataTypes.DATE, 
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  createdBy: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, { 
  sequelize, 
  tableName: 'subcategory',
  timestamps: false
});

export default Subcategory;
