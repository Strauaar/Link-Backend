

export const newUser = (number) => {
    db.query('INSERT INTO users (number, created_at) VALUES ($1, $2) ON CONFLICT (number) DO NOTHING;', [number, new Date() ], (err, res) => {
    if (err) throw err;
    db.end();
  });
};

export const getStatus = () => {
    db.query('SELECT status FROM queries JOIN users ON users.id = queries.user_id;',(err, res) => {
    if (err) throw err;
    console.log(res)
    db.end();
  });
};
