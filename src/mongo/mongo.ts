import mongoose from "mongoose";
import { NewsEntry } from "./entrySchema.js";

interface INewsEntry {
  title: string,
  time: string,
  text?: string[],
  url: string
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

  async checkEntryExist(entry: INewsEntry): Promise<boolean> {
    const existingEntry = await NewsEntry.exists(entry);

    if (existingEntry !== null) {
      return true;
    } else {
      return false;
    }
  }

  async addEntry(entry: INewsEntry): Promise<boolean> {
    try {
      await NewsEntry.create(entry);
    } catch (error) {
      return false;
    }
    return true;
  }
}
