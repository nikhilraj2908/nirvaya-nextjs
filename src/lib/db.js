import mongoose from 'mongoose';
import dns from 'dns';

// Configure public DNS resolvers to handle Atlas SRV query resolution reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const DEFAULT_URI = 'mongodb+srv://nikhilraj2908_db_user:tsHx1KDY6cmj5joj@cluster0.tv1giow.mongodb.net/nirvaya_db?retryWrites=true&w=majority&appName=Cluster0';
const RAW_MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

/**
 * Resolves Atlas mongodb+srv URIs to direct seedlist URIs via public DNS.
 * This resolves Windows & ISP DNS issues where SRV queries fail with querySrv ECONNREFUSED.
 */
async function resolveAtlasUri(uri) {
  if (!uri || !uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  try {
    const parsed = new URL(uri.replace('mongodb+srv://', 'http://'));
    const srvHost = parsed.hostname;
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

    const [srvRecords, txtRecords] = await Promise.all([
      resolver.resolveSrv('_mongodb._tcp.' + srvHost).catch(() => null),
      resolver.resolveTxt(srvHost).catch(() => [])
    ]);

    let hostList = '';
    let replicaSet = '';

    if (srvRecords && srvRecords.length > 0) {
      hostList = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');
    } else if (srvHost === 'cluster0.tv1giow.mongodb.net') {
      hostList = 'ac-udmtona-shard-00-00.tv1giow.mongodb.net:27017,ac-udmtona-shard-00-01.tv1giow.mongodb.net:27017,ac-udmtona-shard-00-02.tv1giow.mongodb.net:27017';
      replicaSet = 'atlas-6dqlvz-shard-0';
    } else {
      return uri;
    }

    const searchParams = new URLSearchParams(parsed.search);
    const txtOptions = (txtRecords[0] || []).join('');
    if (txtOptions) {
      const txtParams = new URLSearchParams(txtOptions);
      for (const [k, v] of txtParams.entries()) {
        if (!searchParams.has(k)) searchParams.set(k, v);
      }
    }
    if (replicaSet && !searchParams.has('replicaSet')) {
      searchParams.set('replicaSet', replicaSet);
    }
    if (!searchParams.has('ssl') && !searchParams.has('tls')) {
      searchParams.set('ssl', 'true');
    }
    if (!searchParams.has('authSource')) {
      searchParams.set('authSource', 'admin');
    }

    const userPass = parsed.username ? `${parsed.username}${parsed.password ? ':' + parsed.password : ''}@` : '';
    const dbPath = parsed.pathname && parsed.pathname !== '/' ? parsed.pathname : '/nirvaya_db';

    return `mongodb://${userPass}${hostList}${dbPath}?${searchParams.toString()}`;
  } catch (err) {
    console.warn('[MongoDB] Public DNS resolution note:', err.message);
    return uri;
  }
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

    cached.promise = (async () => {
      // Step 1: Pre-resolve SRV if running on Windows/Node where SRV is blocked
      const connectionUri = await resolveAtlasUri(RAW_MONGODB_URI);

      try {
        const instance = await mongoose.connect(connectionUri, opts);
        console.log(`[MongoDB Atlas] Connected successfully to database: "${instance.connection.name}"`);
        return instance;
      } catch (firstErr) {
        // If initial connection failed with querySrv error, retry with direct shard fallback
        if (firstErr.message && firstErr.message.includes('querySrv')) {
          console.warn('[MongoDB] Initial SRV query failed, retrying with direct replica set fallback...');
          const fallbackUri = 'mongodb://nikhilraj2908_db_user:tsHx1KDY6cmj5joj@ac-udmtona-shard-00-00.tv1giow.mongodb.net:27017,ac-udmtona-shard-00-01.tv1giow.mongodb.net:27017,ac-udmtona-shard-00-02.tv1giow.mongodb.net:27017/nirvaya_db?ssl=true&replicaSet=atlas-6dqlvz-shard-0&authSource=admin&retryWrites=true&w=majority';
          const instance = await mongoose.connect(fallbackUri, opts);
          console.log(`[MongoDB Atlas] Connected successfully via fallback: "${instance.connection.name}"`);
          return instance;
        }
        throw firstErr;
      }
    })();
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
