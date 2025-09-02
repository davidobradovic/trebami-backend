import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  orderId: string;
  senderId: number;
  senderType: 'customer' | 'worker' | 'admin';
  receiverId: number;
  receiverType: 'customer' | 'worker' | 'admin';
  content: string;
  messageType: 'text' | 'image' | 'file' | 'location';
  attachments?: string[];
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  orderId: { type: String, required: true },
  senderId: { type: Number, required: true },
  senderType: { 
    type: String, 
    enum: ['customer', 'worker', 'admin'],
    required: true
  },
  receiverId: { type: Number, required: true },
  receiverType: { 
    type: String, 
    enum: ['customer', 'worker', 'admin'],
    required: true
  },
  content: { type: String, required: true },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'file', 'location'],
    default: 'text'
  },
  attachments: [{ type: String }],
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, {
  timestamps: true
});

messageSchema.index({ orderId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ isRead: 1, receiverId: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);
