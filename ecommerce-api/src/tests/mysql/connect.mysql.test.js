const mysql = require('mysql2');

// create the connection to database
const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'passroot',
  database: 'shopDEV',
  port: '3306',

});

const batchSize = 10000;
const totalSize = 10000000;

let currentId = 1;

const insertBatch = async () => {
  const values = [];

  for (let i = 0; i < batchSize && currentId <= totalSize; i += 1) {
    const name = `$name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;

    values.push([currentId, name, age, address]);
    currentId += 1;
  }

  if (!values.length) {
    pool.end(err => {
      if (err) {
        console.log('error occurred while running batch');
      } else {
        console.log('Connection poll closed successfully');
      }
    });
  }

  const sql = 'INSERT INTO test_table (id,name, age, address) VALUES ?';

  pool.query(sql, [values], async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      await insertBatch();
      console.log(`Inserted ${result.affectedRows} rows into test_table`);
    }
  });
};

(async () => {
  await insertBatch();
})();
