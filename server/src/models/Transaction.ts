import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  description: string;
  amount: number;
  date: Date;
  category?: string;
}

const transactionSchema = new Schema<ITransaction>({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, default: 'Uncategorized' },
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
