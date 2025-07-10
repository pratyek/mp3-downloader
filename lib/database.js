import { MongoClient } from 'mongodb';
import { config } from '../config.js';

let client = new MongoClient(config.mongodb.uri, config.mongodb.options);

// Helper function to get the MongoDB collection
export async function getDownloadCollection() {
  if (!client.isConnected || !client.isConnected()) {
    await client.connect();
  }
  const db = client.db(config.mongodb.dbName);
  return db.collection(config.mongodb.collection);
}

// Helper function to close the database connection
export async function closeConnection() {
  if (client) {
    await client.close();
  }
} 