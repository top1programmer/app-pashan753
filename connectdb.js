
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: 'us-cdbr-east-05.cleardb.net',
  user: "bf32e628843996",
  database: "heroku_09d6caf22145169",
  password: "a0fe488d"
});
connection.connect(function(err){
  if (err) {
    return console.error("Ошибка: " + err.message);
  }
  else{
    console.log("Подключение к серверу MySQL успешно установлено");
  }
});

const getItems = () =>{
  connection.query("SELECT * FROM local_user",
  function(err, results, fields) {
    // console.log(err);
    // console.log(results); // собственно данные
    // console.log(fields); // мета-данные полей
    return results
  });
}
//connection.end();

module.exports = getItems;
