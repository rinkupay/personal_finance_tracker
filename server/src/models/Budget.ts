import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  food: number;
  transportation: number;
  entertainment: number;
  utilities: number;
  other: number;
}

const budgetSchema = new Schema<IBudget>({
  food: { type: Number },
  transportation: { type: Number },
  entertainment: { type: Number },
  utilities: { type: Number },
  other: { type: Number },
});

export default mongoose.model<IBudget>('Budget', budgetSchema);
