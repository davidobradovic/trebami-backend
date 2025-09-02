import mongoose, { Schema, Document } from 'mongoose';

export interface IAdvertisement extends Document {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  priority: number;
  targetAudience: 'all' | 'customers' | 'workers' | 'specific-category';
  targetCategoryId?: number;
  targetSubcategoryId?: number;
  clicks: number;
  impressions: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
}

const advertisementSchema = new Schema<IAdvertisement>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 1, min: 1, max: 10 },
  targetAudience: { 
    type: String, 
    enum: ['all', 'customers', 'workers', 'specific-category'],
    default: 'all'
  },
  targetCategoryId: { type: Number },
  targetSubcategoryId: { type: Number },
  clicks: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  createdBy: { type: Number, required: true }
}, {
  timestamps: true
});

advertisementSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
advertisementSchema.index({ targetAudience: 1, targetCategoryId: 1 });
advertisementSchema.index({ priority: -1, createdAt: -1 });

export default mongoose.model<IAdvertisement>('Advertisement', advertisementSchema);
