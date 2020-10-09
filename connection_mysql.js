const mysql = require('mysql');

const config = {
    host: '37.59.55.185',
    user: 'cI1YY54LP2',
    password: 'Kmq7LXI0QL',
    database: 'cI1YY54LP2'
};

let connection = mysql.createConnection(config);

connection.connect((err) => {
    if (err) {
      return console.error('error: ' + err.message);
    }
  console.log('Connected to the MySQL server.');
  });

let getRowUser = (callback) =>{
     connection.query('SELECT * FROM users', (err,rows) => {
        if(err) throw err;
       return  callback(rows)
      });
}

let insertUser = (data, callback) => {
    connection.query('INSERT INTO users SET ?' , data , (err , res) => {
        if(err) throw err;
        return callback(res)
    })
}

module.exports.getRowUser = getRowUser;
module.exports.insertUser = insertUser;

