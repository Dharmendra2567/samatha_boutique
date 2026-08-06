import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name' ? process.env.DB_NAME : 'samatha_boutique';

let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

export async function getDb() {
  if (cached.client) return cached.client.db(dbName);
  if (!cached.promise) {
    cached.promise = MongoClient.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Timeout server selection after 5 seconds instead of hanging
      connectTimeoutMS: 5000,         // Timeout connection establishment after 5 seconds
      socketTimeoutMS: 15000          // Socket timeout
    }).catch(err => {
      cached.promise = null; // Clear cached promise on failure so next request can retry
      throw err;
    });
  }
  try {
    cached.client = await cached.promise;
  } catch (err) {
    cached.promise = null; // Clear cached promise on await failure as well
    throw err;
  }
  return cached.client.db(dbName);
}

export { dbName };
