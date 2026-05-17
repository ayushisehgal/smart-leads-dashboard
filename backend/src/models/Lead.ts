import mongoose, { Schema } from 'mongoose';
import { ILead } from '../types';

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'],
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ name: 'text', email: 'text' });
LeadSchema.index({ createdAt: -1 });

export default mongoose.model<ILead>('Lead', LeadSchema);