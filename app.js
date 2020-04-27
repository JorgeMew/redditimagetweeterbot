const express = require("express");
const Twit = require("twit");
const fs = require('fs');
const download = require('image-downloader');
const request = require('request');

var T = new Twit({
    consumer_key: 'gMnJpakEaJURtObLO0IWejSkx',
    consumer_secret: 'LxnKBAQYKJiUQ8psp31tcCBWSkEv1dhQ0em7wpE4XcLIQ8BW65',
    access_token: '1228304741911990272-PZL1mJC3RpPN3wn6cXuPXfAcOd3rrp',
    access_token_secret: 'SqBj3VqwYdFxrrW1vzgmJlxgb8ysy7CkSJGT3vDhM3Dam',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
});

const options = {
    url: 'https://pawelgrzybek.com/photos/2017-01-18-1.jpg',
    dest: './imgs/photo.png' // Save to /path/to/dest/image.jpg
}




var p1 = new Promise(async (resolve, reject) => {

    var status = await downloadImage();
    console.log(status + " P1 status")
    if (status == "Success") {
        resolve('Success');

    } else if (status == "Failed") {
        reject('Failed');
    }
});
p1.then(() => {
    console.log("Image Downloaded, now the next step:");
    uploadImgTwitter();

}).catch(() => {
    console.log("Couldn't download Image");
});

function downloadImage() {
    return download.image(options)
        .then(({
            filename,
            image
        }) => {
            console.log('Saved to', filename) // Saved to /path/to/dest/image.jpg
            return 'Success';
        })
        .catch((err) => {
            console.error(err);
            return "Failed";
        })
}


var mediaId;
function uploadImgTwitter() {
    var filePath = 'imgs/photo.png'
    return T.postMediaChunked({
        file_path: filePath
    }, function (err, data, response) {
        console.log(data.media_id_string + "Image Uploaded")
        mediaId = (data.media_id_string);
        tweetIt();
    });
}

function tweetIt() {
    //tweet it
     T.post('statuses/update', {status: 'Heyoo', media_ids:mediaId}, function(err, data, response) {
        console.log(data)
      })  
}