import mongoose from 'mongoose';

const NewsEntrySchema = new mongoose.Schema({
  galnet_id: {
    required: true,
    type: String,
    unique: true
  },
  title: {
    required: true,
    type: String
  },
  date: {
    required: true,
    type: String
  },
  text: [
    {
      type: String
    }
  ],
  url: {
    required: true,
    type: String,
  },
  image: {
    type: String
  }
}, { timestamps: true });

export const NewsEntry = mongoose.model('NewsEntry', NewsEntrySchema, 'News');
