import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';
import { Subcategory } from './Subcategory';

export interface CategoryAttributes {
  id?: number;
  title: string;
  icon?: string;
  createdAt?: Date;
  createdBy?: number;
  isActive?: boolean;
  description?: string;
  color?: string;
}

export class Category extends Model<CategoryAttributes> implements CategoryAttributes {
  public id!: number;
  public title!: string;
  public icon?: string;
  public createdAt?: Date;
  public createdBy?: number;
  public isActive?: boolean;
  public description?: string;
  public color?: string;
}

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'category',
  timestamps: false,
});

export default Category;
