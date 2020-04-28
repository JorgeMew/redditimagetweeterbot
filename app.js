const Twit = require("twit");
const download = require('image-downloader');
const request = require('request');

var T = new Twit({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
});

var mediaId;
var imageUrl;
var postTitle;
var postLink;
var statusText;
var parsedData;
let options = {
    url: "",
    dest: './imgs/photo.png' // Save to /path/to/dest/image.jpg
}
getImage();
setInterval(getImage, 3.6e+6); // Script runs every Hour

function getImage() {
    request("https://www.reddit.com/r/dogpictures/rising/.json", function (error, response, body) { // requesting reddit's json
        if (!error && response.statusCode == 200) {
            parsedData = JSON.parse(body).data.children[0].data; //turning JSON into objects
            console.log("Getting information from Reddit...")
            imageUrl = parsedData.url;
            postTitle = parsedData.title;
            postLink = "reddit.com" + parsedData.permalink;
            statusText = postTitle + " " + postLink; // creating the text for the status update
            console.log("IMG URL: " + imageUrl + "\nPOST TITLE: " + postTitle + "\nPOST LINK: " + postLink)
            console.log("Checking if title needs to be shortened to fit 240 characters");
            if (statusText.length >= 280) { //making sure the status update fits the 280 maximum requirement
                console.log("Shortening title...")
                postTitle = postTitle.substring(0, (postTitle.length - (statusText.length - 286))) // removing the necessary letters 
                statusText = postTitle + "(...) " + postLink; // adding (...) to the status update
                console.log("Title shortened to: " + postTitle);
                downloadImage();
            } else {
                console.log("Title fits.")
                downloadImage();
            }
        }
    })
}
function downloadImage() { // downloading our image to a local folder
    options.url = imageUrl;
    return download.image(options)
        .then(({
            filename,
            image
        }) => {
            console.log('Image Download and Saved to', filename);
            uploadImgTwitter();
        })
        .catch((err) => {
            console.error(err);
            return "Failed";
        })
}

function uploadImgTwitter() { // uploading our image to the twitter servers
    console.log("Uploading Image to Twitter...")
    var filePath = 'imgs/photo.png'
    return T.postMediaChunked({
        file_path: filePath
    }, function (err, data, response) {
        console.log(data.media_id_string + "Image Uploaded");
        mediaId = (data.media_id_string);
        tweetIt();
    });
}


function tweetIt() { // actually tweet the status and image
    console.log("Posting...")
    //tweet it
    T.post('statuses/update', {
        status: statusText,
        media_ids: mediaId
    }, function (err, data, response) {
        console.log(data)
    });
    console.log("All Done.")
}