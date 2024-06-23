import mongoose from "mongoose";

export default class Database {
  #uri;

  constructor() {
    const { HOST, PORT, MONGO_URI } = process.env;
    this.#uri = `${MONGO_URI}`;
  }

  async connect() {
    try {
      await mongoose.connect(this.#uri);
      console.log(`Database connection to ${this.#uri} was successful`);
    } catch (error) {
      console.error("Database connection error", error);
      throw error;
    }
  }

  close = async () => {
    await mongoose.disconnect();
  };
}
