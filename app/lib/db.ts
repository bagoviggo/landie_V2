// PostgreSQL database utility using the 'postgres' package
import postgres from 'postgres';

// Use DATABASE_URL from environment variables
const sql = postgres(process.env.DATABASE_URL || '', {
  ssl: 'require',
});

export default sql;
