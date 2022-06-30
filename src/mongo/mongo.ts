import mongoose, { Query } from "mongoose";
import { NewsEntry } from "./entrySchema.js";

interface INewsEntry {
  galnet_id: string;
  title: string;
  date: string;
  text: string[];
  url: string;
  image: string;
}

export class DbOperations {
  private connection?: mongoose.Mongoose;

  constructor(connectionString: string) {
    mongoose.connect(connectionString)
      .then((connection) => {
        this.connection = connection;
      })
      .catch(err => {
        throw err;
      });
  }

  async checkEntryExist(id: string): Promise<boolean> {
    const existingEntry = await NewsEntry.exists({ galnet_id: id });

    if (existingEntry !== null) {
      return true;
    } else {
      return false;
    }
  }

  async addEntry(entry: INewsEntry): Promise<boolean> {
    try {
      await NewsEntry.findOneAndUpdate({ url: entry.url }, entry, { upsert: true });
    } catch (error) {
      console.log(error);

      return false;
    }
    return true;
  }
}
