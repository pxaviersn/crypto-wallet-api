import { model, Schema } from 'mongoose';

const OperationSchema = new Schema({
  coin: { type: String, required: true },
  date: { type: Date, required: true },
  coinPrice: { type: Number, required: true },
  value: { type: Number, required: true },
  exchangeFee: { type: Number, required: true },
  quantityCrypto: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true });


export default model('Operation', OperationSchema);
