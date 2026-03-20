import mongoose from 'mongoose';

const crowdSchema = new mongoose.Schema(
  {
    templeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true, unique: true },
    crowd:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Crowd = mongoose.models.Crowd || mongoose.model('Crowd', crowdSchema);