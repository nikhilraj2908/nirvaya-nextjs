import mongoose from 'mongoose';
import dns from 'dns';

// Configure public DNS resolvers to handle Atlas SRV query resolution reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nikhilraj2908_db_user:tsHx1KDY6cmj5joj@cluster0.tv1giow.mongodb.net/nirvaya_db?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log(`[MongoDB Atlas] Connected successfully to database: "${mongooseInstance.connection.name}"`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[MongoDB Connection Error]:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
