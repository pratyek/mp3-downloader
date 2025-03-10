import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-downloader';
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  console.warn('No MongoDB URI provided, using local development database');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new connection for each request
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDownloadCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection('downloads');
}

