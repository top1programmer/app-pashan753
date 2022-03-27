const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const mysql = require("mysql2");
const fs = require('fs')
const cloudinary = require('cloudinary')
const PORT = process.env.PORT || 5000
let bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const schedule = require('node-schedule');

const connection = mysql.createPool({
  host: 'us-cdbr-east-05.cleardb.net',
  user: "bf32e628843996",
  database: "heroku_09d6caf22145169",
  password: "a0fe488d"
});

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

app.post('/api/login', async (req, res) =>{
  const {email, password } = req.body
  const hashPassword = await bcrypt.hash(password, 7)
  connection.query(`select * from local_user
    where lower(email)=lower("${email}")`, async function(err, results){
      if(results && !results.length){
        connection.query(`insert into local_user(email, password)
        values('${email}', "${hashPassword}")`, function(err, insertResult){
          connection.query(`select * from local_user where id='${insertResult.insertId}'`,
          function(err, results){
            res.json({ email, role: results[0].role, user_id: results[0].id});

          })
        })
      }
      else{
        const isMatch = await bcrypt.compare(password, results[0].password)
        if(!isMatch){
          return res.status(400).json({message: "invalid email or password" })
        }
        else {
          const token = jwt.sign({id:results[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
          res.json({
            message: "logged in",
            token,
            email: results[0].email,
            role: results[0].role,
            user_id: results[0].id
          })
        }
      }
    })
  })

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
  })

  // sql = `select b.*, si.source from (select rw.*, ifnull((select rating from rating where review_id=rw.id and rating.user_id =rw.user_id),0) as rating
  // FROM review rw, local_user lu
  // where rw.user_id=lu.id and upper(lu.email)=upper('${req.body.email}')) b left join image_sources si on b.id=si.review_id`
app.post('/api/get-reviews', async (req, res)=>{
  try{
    if(req.body.textToSearch !== ''){
      connection.query('insert into searched_text(text) values(?)', [req.body.textToSearch] )
    }
    let sql = ''
    if(req.body.textToSearch !== '' && req.body.user_id){
      sql = `SELECT * FROM review WHERE user_id="${req.body.user_id}" and
        MATCH(name,text) AGAINST('${req.body.textToSearch}*' IN BOOLEAN MODE)`
    }
    else if(req.body.textToSearch !== '' && !req.body.user_id){
      sql = `SELECT * FROM review WHERE
      MATCH(name,text) AGAINST('${req.body.textToSearch}*' IN BOOLEAN MODE)`
    }
    else if(req.body.user_id && req.body.textToSearch === ''){
      // sql = `select rw.* FROM review rw
      // where rw.user_id= and upper(lu.email)=upper('${req.body.email}')`
      sql = `select * FROM review where user_id="${req.body.user_id}"`
    }
    else {
      // sql = "select rw.*, si.source from review rw left join image_sources si on rw.id=review_id order by rw.id"
      sql = "select * from review "
    }
    connection.query(sql, function(err, results, fields) {
      if(err)console.log('err', err);
        res.json({result: results})
    })
  } catch(error){ console.log(error)}
})

app.post('/api/change-rating', async (req, res) => {
  try{
    let like = req.body.isLiked? 0 : 1
    connection.query(`select * from rating where user_id="${req.body.user_id}" and
      review_id="${req.body.review_id}"`, function(err, results){
        console.log(err);
        if(results.length > 0){
          connection.query(`update rating set rating=${req.body.rating},
            like_value=${like}
            where user_id="${req.body.user_id}" and review_id="${req.body.review_id}"`,
            function(err, results){
              if(err) console.log(err);
            })
        }
        else{
          connection.query(`insert into rating(user_id, review_id, like_value, rating)
            values("${req.body.user_id}", "${req.body.review_id}",
            "${like}", "${req.body.rating}")`)
        }
      })
  } catch(err){ console.log(err)}
})

cloudinary.config({
  cloud_name: 'dhnwkn1xz',
  api_key: '928683671869463',
  api_secret: '9kauke3gwTDfYks8dRiARCNzrR8',
})

const loadImagesToCloud = async (files, review_id) => {
  try{
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
        connection.query(
          `insert into image_sources(review_id, source, public_id)
          values(${review_id}, '${item.secure_url}', '${item.public_id}')`)
        })
      } catch(err){ console.log(err)}
}

const updateTags = async (id, tagsToInsert, tagsToRemove) => {
  if(tagsToRemove){
    tagsToRemove.forEach(item => {
      connection.query(
        `delete from tags where review_id="${id}", tag_value="${item}" `)
      })
  }
  tagsToInsert.forEach(item => {
    connection.query(`insert into tags(review_id, tag_value)
      values("${id}","${item}") `)
  })
}


app.post('/api/save', async (req, res) => {
  connection.query(
    `UPDATE review SET name="${req.body.name}", text="${req.body.text}", category="${req.body.category}"
    WHERE id="${req.body.id}"`,
    function(err, results) {
      if(err) console.log(err);
      else console.log("Тaaаблица создана");
    })
    await loadImagesToCloud(req.body.files, req.body.id)
    await updateTags(
      req.body.id, req.body.tagsToInsert, req.body.tagsToRemove)
      req.body.imagesToRemove.forEach(item =>{
        cloudinary.v2.uploader.destroy(item.public_id)
        .then(connection.query(`delete from image_sources where id=${item.id}`))
        .catch(error=> console.log(error.message))

      })
})

app.post('/api/create-review', async (req, res) => {
  connection.query(
    `insert into review(user_id, name, text, category)
    values("${req.body.user_id}", "${req.body.name}", "${req.body.text}", "${req.body.category}")`, function(err, results){
      console.log(err);
      loadImagesToCloud(req.body.files, results.insertId)
      updateTags(results.insertId, req.body.tagsToInsert)
      res.json({result: results.insertId})
  })
})

app.post('/api/remove-review', async (req, res) => {
  connection.query(`DELETE FROM review WHERE id="${req.body.id}"`)
})

app.post('/api/get-users', async (req, res)=>{
  connection.query("SELECT id, role, email FROM local_user",
  function(err, results, fields) {
    if(results)
    res.json({result: results})
  });
})

app.post('/api/get-rating', async (req, res) => {
  connection.query(
    `select * from rating where review_id="${req.body.review_id}"`,
    function(err, results){
      if(err) console.log(err);
      if(results.length && results.length > 0){
        let rating = results.reduce((agr, item) => agr + item.rating, 0) /( results.length || 1)
        let all_likes = results.reduce((agr, item) => agr + item.like_value, 0)
        let isUser = false
        if(results.find(item => item.user_id === req.body.user_id ) &&
         results.find(item => item.user_id === req.body.user_id ).like_value > 0)
         isUser = true
         connection.query(`update review set rate='${rating}',
         all_likes='${all_likes}'
         where id='${req.body.review_id}'`)
         res.json({result: {rating, all_likes, isUser }})
      }
  })
})

app.post('/api/get-images', async (req, res) => {
  connection.query(
    `select * from image_sources
    where review_id="${req.body.review_id}"`,
    function(err, results){
      res.json({result: results})
  })
})

app.post('/api/get-tags', async (req, res) => {
  connection.query(
    `select * from tags t where t.review_id="${req.body.review_id}"`,
    function(err, results){
      res.json({result: results})
  })
})

app.post('/api/search', async (req, res) => {
  connection.query(
    `SELECT * FROM review WHERE MATCH(name,text)
    AGAINST('${req.body.textToSearch}' IN NATURAL LANGUAGE MODE)`,
    function(err, results){
      res.send({result: results})
  })
})

app.post('/api/make-admin', async (req, res) => {
  connection.query(
    `UPDATE local_user SET role="admin" WHERE id="${req.body.id}"`,
    function(err, results){
      res.send({result: results})
  })
})
app.post('/api/suggest-request', async (req, res) => {
  connection.query(
    `select st.text, count(*) kolvo from searched_text st
    where st.text like '${req.body.searchValue}%' group by st.text order by kolvo desc limit 10`,
    function(err, results){
      res.send({result: results})
  })
})

app.post('/api/remove-user', async (req, res) => {
  connection.query(`DELETE FROM local_user WHERE id="${req.body.id}"`)
})

app.post('/api/get-tag-cloud', async (req, res) => {
  connection.query(`select *, count(*) kolvo from tags
   group by tag_value order by kolvo desc limit 10`, function(err, results){
     res.json({result: results})
   })
})
app.post('/api/getReviewsByTag', async (req, res) => {
  connection.query(`select review_id from tags
    where tag_value='${req.body.tag}'`, function(err, results){
     if(results && results.length){
       results = results.map( item => item.review_id)
       console.log(results);
       connection.query(`select * from review
       where id IN (?)`, [results], function( err_user, result_user ) {
          console.log(result_user);
          res.json({result: result_user})
        })
     }
   })
})

const job = schedule.scheduleJob('25 * * * *', function(){
  console.log('Time for tea!');

});

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, '/build/index.html')));

app.listen(PORT, () => {
  console.log(
    `Server is ready at http://localhost:${process.env.PORT || 5000}`
  );
});
