import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../database';

export interface UserAttributes {
  id: number;
  fullName: string | null;
  email: string | null;
  password: string | null;
  role: 'user' | 'worker' | 'admin' | null;
  workerId?: number | null;
  usedRefferal?: number | null;
  refferal?: number | null;
  bannedAt?: Date | null;
  banReason?: string | null;
  bannedBy?: number | null;
  createdAt?: Date | null;
  isActive?: boolean;
  phoneNumber?: string | null;
  profileImage?: string | null;
  lastLoginAt?: Date | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public fullName!: string | null;
  public email!: string | null;
  public password!: string | null;
  public role!: 'user' | 'worker' | 'admin' | null;
  public workerId!: number | null;
  public usedRefferal!: number | null;
  public refferal!: number | null;
  public bannedAt!: Date | null;
  public banReason!: string | null;
  public bannedBy!: number | null;
  public createdAt!: Date | null;
  public isActive!: boolean;
  public phoneNumber!: string | null;
  public profileImage!: string | null;
  public lastLoginAt!: Date | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING(45), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: true },
    role: { type: DataTypes.ENUM('user', 'worker', 'admin'), allowNull: true },
    workerId: { type: DataTypes.INTEGER, allowNull: true },
    usedRefferal: { type: DataTypes.INTEGER, allowNull: true },
    refferal: { type: DataTypes.INTEGER, allowNull: true },
    bannedAt: { type: DataTypes.DATE, allowNull: true },
    banReason: { type: DataTypes.TEXT('long'), allowNull: true },
    bannedBy: { type: DataTypes.INTEGER, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    phoneNumber: { type: DataTypes.STRING(20), allowNull: true },
    profileImage: { type: DataTypes.STRING(255), allowNull: true },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
