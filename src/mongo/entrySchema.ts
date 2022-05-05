import mongoose from 'mongoose';

const NewsEntrySchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  time: {
    required: true,
    type: String
  },
  text: [
    {
      required: true,
      type: String
    }
  ],
  url: {
    required: true,
    type: String,
    unique: true
  }
});

export const NewsEntry = mongoose.model('NewsEntry', NewsEntrySchema, 'News');
