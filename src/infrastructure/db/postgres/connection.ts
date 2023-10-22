import pg from "pg"

import "dotenv/config"

export const connection = new pg.Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  ssl: {
    rejectUnauthorized: false,
  },
})