import { connect as mconnect } from "mongoose";
import { brotliDecompress } from "zlib";

class Database {
  private static instance: Database;
  private static connection: any;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    Database.connection = await mconnect(
      "mongodb+srv://manish774:1Wlk48jFMficmKFD@cluster0.ld21j.mongodb.net/randomriddle"
    );

    return Database.connection;
  }
}

export const DB = Database.getInstance();
