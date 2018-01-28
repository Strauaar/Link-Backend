const { Client } = require('pg');

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

db.connect();

export const newUser = (number) => {
    db.query('INSERT INTO users (number, created_at) VALUES ($1, $2) ON CONFLICT (number) DO NOTHING;', [number, new Date() ], (err, res) => {
    if (err) throw err;
    db.end();
  });
};
