import mongoose, { Schema, Document } from 'mongoose';

export interface IWorker extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  categoryId: number;
  subcategoryId: number;
  location: {
    type: string;
    coordinates: number[];
    address: string;
    city: string;
    postalCode: string;
  };
  ratings: number;
  reviews: number;
  totalJobs: number;
  completedJobs: number;
  hourlyRate: number;
  isAvailable: boolean;
  isVerified: boolean;
  profileImage?: string;
  description?: string;
  skills: string[];
  experience: number;
  education?: string;
  certifications: string[];
  workingHours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  createdAt: Date;
  updatedAt: Date;
}

const workerSchema = new Schema<IWorker>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  categoryId: { type: Number, required: true },
  subcategoryId: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  ratings: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  hourlyRate: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String },
  description: { type: String },
  skills: [{ type: String }],
  experience: { type: Number, default: 0 },
  education: { type: String },
  certifications: [{ type: String }],
  workingHours: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: false } },
    sunday: { start: String, end: String, available: { type: Boolean, default: false } }
  }
}, {
  timestamps: true
});

workerSchema.index({ location: '2dsphere' });
workerSchema.index({ categoryId: 1, subcategoryId: 1 });
workerSchema.index({ isAvailable: 1, isVerified: 1 });

export default mongoose.model<IWorker>('Worker', workerSchema);
