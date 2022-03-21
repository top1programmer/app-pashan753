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
// app.use(express.limit('5mb'));
dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  connection.query(`select * from local_user where email='${email}'`,
  function(err, results){
    if(err) console.log('ashibka',err);
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

const collectReviews = (data) => {
  let resArr = []
  if(data && data.length){
    for(let i = 0; i < data.length; i++ ){
      if(i == 0){
        resArr.push(data[0])
        resArr[0].img_source = []
        resArr[0].img_source.push(resArr[0].source)
        continue
      }
      if(data[i].id === resArr[resArr.length - 1].id){
        resArr[resArr.length - 1].img_source.push(data[i].source)
      }
      else{
        resArr.push(data[i])
        resArr[resArr.length - 1].img_source = []
        resArr[resArr.length - 1].img_source.push(resArr[resArr.length - 1].source)
      }
    }
  }
  return resArr
}
// sql = `select b.*, si.source from (select rw.*, ifnull((select rating from likes where review_id=rw.id and likes.user_id =rw.user_id),0) as rating
// FROM review rw, local_user lu
// where rw.user_id=lu.id and upper(lu.email)=upper('${req.body.email}')) b left join image_sources si on b.id=si.review_id`

app.post('/api/get-reviews', async (req, res)=>{
  try{
    // console.log(req.body);
    let sql = ''
    if(req.body.textToSearch !== '' && req.body.user_id){
        sql = `SELECT * FROM review WHERE user_id="${req.body.user_id}" and
        MATCH(name,text) AGAINST('${req.body.textToSearch}*' IN BOOLEAN MODE)`
    }
    else if(req.body.textToSearch !== '' && !req.body.user_id){
      sql = `SELECT * FROM review WHERE
      MATCH(name,text) AGAINST('${req.body.textToSearch}*' IN BOOLEAN MODE)`
    }
    else if(req.body.user_id && req.body.user_id !== ''){
      // sql = `select rw.* FROM review rw
      // where rw.user_id= and upper(lu.email)=upper('${req.body.email}')`
      sql = `select * FROM review where user_id="${req.body.user_id}"`
    }
    else {
      // sql = "select rw.*, si.source from review rw left join image_sources si on rw.id=review_id order by rw.id"
      sql = "select * from review "
    }
    let dataToResponse = []
    connection.query(sql, function(err, results, fields) {
      // dataToResponse = collectReviews(results)
      // console.log(dataToResponse);
      // res.json({result: dataToResponse})
        // console.log(sql);
        // console.log(err);
        // console.log(results);
       res.json({result: results})
    })
  } catch(error){ console.log(error)}
});

app.post('/api/change-rating', async (req, res) => {
  console.log(req.body);
  let like = req.body.isLiked? 0 : 1
  console.log(like);
  console.log('rate');
  connection.query(`select * from likes where user_id="${req.body.user_id}" and
  review_id="${req.body.review_id}"`, function(err, results){
    console.log(results);
    if(results){
      connection.query(`update likes set rating=${req.body.rating},
        like_value=${like}
        where user_id="${req.body.user_id}" and review_id="${req.body.review_id}"`,
        function(err, results){
          console.log(err);
          console.log(results);
        })
      }
      else{
        connection.query(`insert into likes(user_id, review_id, like_value, rating)
        values("${req.body.user_id}", "${req.body.review_id}",
        "${like}", "${req.body.rating}")`)
      }
    })
  })

  cloudinary.config({
    cloud_name: 'dhnwkn1xz',
    api_key: '928683671869463',
    api_secret: '9kauke3gwTDfYks8dRiARCNzrR8',
  })

  const loadImagesToCloud = async (files, review_id) => {
    let promises = []
    files.forEach(async image => {
      promises.push(
        cloudinary.v2.uploader.upload(
          image,
          {folder: 'itransition-folder'})
        )
      })
      const response = await Promise.all(promises)
      response.forEach(item => {
        connection.query(`insert into image_sources(review_id, source, public_id)
        values(${review_id}, '${item.secure_url}', '${item.public_id}')`)
      })
    }

    const updateTags = async (id, tagsToInsert, tagsToRemove) => {
      if(tagsToRemove){
        tagsToRemove.forEach(item => {
          connection.query(`delete from tags where review_id="${id}", tag_value="${item}" `)
        })
      }
      tagsToInsert.forEach(item => {
        connection.query(`insert into tags(review_id, tag_value)
        values("${id}","${item}") `)
      })
    }


    app.post('/api/save', async (req, res) => {
      connection.query(`UPDATE review SET name="${req.body.name}", text="${req.body.text}" WHERE id="${req.body.id}"`,
      function(err, results) {
        if(err) console.log(err);
        else console.log("Тaaаблица создана");
      })
      loadImagesToCloud(req.body.files, req.body.id)
      updateTags(req.body.id, req.body.tagsToInsert, req.body.tagsToRemove)
      console.log('img', req.body.imagesToRemove);
      req.body.imagesToRemove.forEach(item =>{
        cloudinary.v2.uploader.destroy(item.public_id)
        .then(connection.query(`delete from image_sources where id=${item.id}`))
        .catch(error=> console.log(error.message))

      })
    })

    app.post('/api/create-review', async (req, res) => {
      connection.query(`insert into review(user_id, name, text)
      values(${req.body.user_id}, '${req.body.name}', '${req.body.text}')`)
      connection.query(` SELECT LAST_INSERT_ID()`, function(err, results){
        loadImagesToCloud(req.body.files, results[0]['LAST_INSERT_ID()'])
        updateTags(results[0]['LAST_INSERT_ID()'], req.body.tagsToInsert)
      })
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

    app.post('/api/get-rating', async (req, res) => {
      connection.query(`select * from likes where review_id="${req.body.review_id}"`,
      function(err, results){
        if(err) console.log(err);
        if(results.length && results.length > 0)
        res.json({result: results})
      })
    })

    app.post('/api/get-images', async (req, res) => {
      connection.query(`select * from image_sources where review_id="${req.body.review_id}"`,
      function(err, results){
        res.json({result: results})
      })
    })

    app.post('/api/get-tags', async (req, res) => {
      connection.query(`select * from tags t where t.review_id="${req.body.review_id}"`,
      function(err, results){
        res.json({result: results})
      })
    })

    app.post('/api/search', async (req, res) => {
      console.log(req.body.textToSearch);
      connection.query(`SELECT * FROM review WHERE MATCH(name,text)
      AGAINST('${req.body.textToSearch}' IN NATURAL LANGUAGE MODE)`,
      function(err, results){
        console.log(results);
        res.send({result: results})
      })
    })

    app.use(express.static(path.join(__dirname, '/build')));
    app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/build/index.html')));

    app.listen(PORT, () => {
      console.log(
        `Server is ready at http://localhost:${process.env.PORT || 5000}`
      );
    });
