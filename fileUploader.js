//Name of the file : dropbox-file-upload.js
//Including the required moduless
var request = require('request');
var fs = require('fs');

//enter your access token
var access_token = "sl.BDQsjc9q4IxiUawzP9EIrJO4OM3R1AmiQaGiT_ukXxHEnZJ8k6nmzlWK-fBwBKU-6fM-HnByQrrQkB4SX28UyQxkk4t2c_jRpz2Sve61qEIdSO1UC-S3zp7HBJLlh3DKwNIg_4DgLWoq";
//Name of the file to be uploaded
var filename = 'images.jpg';
//reading the contents
var content = fs.readFileSync(filename);
//write your folder name in place of YOUR_PATH_TO_FOLDER
// For example if the folder name is njera then we can write it in the following way :
// "Dropbox-API-Arg": "{\"path\": \"/njera/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}"
options = {
            method: "POST",
            url: 'https://content.dropboxapi.com/2/files/upload',
            headers: {
              "Content-Type": "application/octet-stream",
              "Authorization": "Bearer " + access_token,
              "Dropbox-API-Arg": "{\"path\": \"/itransition-project/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
            },
            body:content
};

request(options, function(err, res,body){
     console.log("Err : " + err);
     console.log("res : " + res);
     console.log("body : " + body);
 })
