import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customerId: number;
  workerId: string;
  categoryId: number;
  subcategoryId: number;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates: number[];
  };
  scheduledDate: Date;
  scheduledTime: string;
  estimatedDuration: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'bank-transfer';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customerNotes?: string;
  workerNotes?: string;
  images: string[];
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

const orderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Number, required: true },
  workerId: { type: String, required: true },
  categoryId: { type: Number, required: true },
  subcategoryId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    coordinates: [{ type: Number, required: true }]
  },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  estimatedDuration: { type: Number, required: true }, // in hours
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'bank-transfer'],
    required: true
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  customerNotes: { type: String },
  workerNotes: { type: String },
  images: [{ type: String }],
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String }
}, {
  timestamps: true
});

orderSchema.index({ customerId: 1, status: 1 });
orderSchema.index({ workerId: 1, status: 1 });
orderSchema.index({ categoryId: 1, subcategoryId: 1 });
orderSchema.index({ scheduledDate: 1, status: 1 });
orderSchema.index({ orderNumber: 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
