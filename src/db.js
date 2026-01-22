import mysql from 'mysql2/promise';

export function createPoolFromEnv() {
  const {
    DB_HOST = '127.0.0.1',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_NAME = 'ecoride'
  } = process.env;

  return mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  });
}
