const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: 'us-cdbr-east-05.cleardb.net',
  user: "bf32e628843996",
  database: "heroku_09d6caf22145169",
  password: "a0fe488d"
});
// connection.connect(function(err){
//   if (err) {
//     return console.error("Ошибка: " + err.message);
//   }
//   else{
//     console.log("Подключение к серверу MySQL успешно установлено");
//   }
// });
//connection.end();

dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());

const users = [];

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  res.status(201);
  res.json({ name, email, picture });
});

app.post('/api/get-reviews', async (req, res)=>{
  if(req.body.email){
    connection.query(`select w.* from review w join local_user lu on lu.id=w.user_id and lu.email = "${req.body.email}"`,
    function(err, results, fields) {
      console.log(results);
      res.json({result: results})
    });
  } else
  connection.query("SELECT * FROM review",
  function(err, results, fields) {
    res.json({result: results})
  });
})

app.post('/api/like', async (req, res) => {
  const sql = `INSERT INTO likes(user_id, review_id) VALUES(${req.body.id}, ${req.body.user_id})`;
connection.query(sql, function(err, results) {
    if(err) console.log(err);
    else console.log("Тaaаблица создана");
  })
})

app.post('/api/save', async (req, res) => {
  connection.query(`UPDATE review SET name="${req.body.name}", text="${req.body.text}" WHERE id="${req.body.id}"`,
   function(err, results) {
      if(err) console.log(err);
      else console.log("Тaaаблица создана");
    })
})

app.post('/api/get-users', async (req, res)=>{
  connection.query("SELECT * FROM local_user",
  function(err, results, fields) {
    res.json({result: results})
  });
})

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/build/index.html')));

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is ready at http://localhost:${process.env.PORT || 5000}`
  );
});
