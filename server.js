const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const mysql = require("mysql2");
const fs = require('fs')
const cloudinary = require('cloudinary')
const PORT = process.env.PORT || 5000

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
//connection.end();

const app = express();
app.use(express.json());

dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

function check(email){
  connection.query(`select * from local_user where email='${email}'`,
  function(err, results){
    if(results){
      return results
    }
    else {
      connection.query(`insert into local_user(email) values(${email})`,
      function(err, results){
        if(err) console.log(err);
        else {
          connection.query(`select * from local_user where email='${email}'`,
          function(err, results){
            if(err) console.log(err);
            else return results
          })
        }
      })
    }
  })
}
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  connection.query(`select * from local_user where email='${email}'`,
  function(err, results){
    if(err) console.log(err);
    if(results){
      res.status(201);
      res.json({name, email, picture, role: results[0].role, user_id: results[0].id});
    }
    else {
      connection.query(`insert into local_user(email) values(${email})`,
      function(err, results){
        if(err) console.log(err);
        else {
          connection.query(`select * from local_user where email='${email}'`,
          function(err, results){
            if(err) console.log(err);
            else {
              res.status(201);
              res.json({ name, email, picture, role: results[0].role, user_id: results[0].id});
            }
          })
        }
      })
    }
  })
});

app.post('/api/get-reviews', async (req, res)=>{
  if(req.body.email){
    connection.query(`select rw.*, ifnull((select count(*) from likes where review_id=rw.id and likes.user_id =rw.user_id),0) as count_likes
    FROM review rw, local_user lu
    where rw.user_id=lu.id and upper(lu.email)=upper('${req.body.email}')`,
    function(err, results, fields) {
      res.json({result: results})
    });
  } else
  connection.query("select rw.*, si.source from review rw left join image_sources si on rw.id=review_id order by rw.id",
  function(err, results, fields) {
    res.json({result: results})
  });
})

app.post('/api/like', async (req, res) => {
  if(req.body.isLiked == false){
    const sql = `INSERT INTO likes(user_id, review_id) VALUES( ${req.body.user_id}, ${req.body.review_id})`;
    connection.query(sql)
  }
  else {
    const sql = `DELETE FROM likes WHERE user_id="${req.body.user_id}" and review_id="${req.body.review_id}"`;
    connection.query(sql, function(err, results) {
      if(err) console.log(err);
      else console.log("лайк  снят");
    })
  }
})

cloudinary.config({
  cloud_name: 'dhnwkn1xz',
  api_key: '928683671869463',
  api_secret: '9kauke3gwTDfYks8dRiARCNzrR8',
})

app.post('/api/save', async (req, res) => {
  connection.query(`UPDATE review SET name="${req.body.name}", text="${req.body.text}" WHERE id="${req.body.id}"`,
  function(err, results) {
    if(err) console.log(err);
    else console.log("Тaaаблица создана");
  })

  let promises = []
  req.body.files.forEach(async image => {
    promises.push(
      cloudinary.v2.uploader.upload(
        image,
        {folder: 'itransition-folder'})
      )
    })
    const response = await Promise.all(promises)
    //res.send(response )
    response.forEach(item => {
      connection.query(`insert into image_sources(review_id, source)
      values(${req.body.id}, '${item.secure_url}')`)
    })
  })

  app.post('/api/create-review', async (req, res) => {
    connection.query(`insert into review(user_id, name, text, img_source)
    values(${req.body.user_id}, '${req.body.name}', '${req.body.text}', 'xxx')`)
  })

  app.post('/api/remove-review', async (req, res) => {
    connection.query(`DELETE FROM review WHERE id="${req.body.id}"`)
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

  app.listen(PORT, () => {
    console.log(
      `Server is ready at http://localhost:${process.env.PORT || 5000}`
    );
  });
