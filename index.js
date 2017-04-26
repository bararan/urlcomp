const express = require("express");
const mongo = require("mongodb");
const urlcomp = require("./app/urlcomp")

const url = "mongodb://" + process.env.DBUSR + ":" + process.env.DBPW + "@" + process.env.DB_URI;
const client = mongo.MongoClient;

client.connect(url, function(err, db) {
    if (err) {
        throw err;
    }
    
    let app = express();
    app.set('port', (process.env.PORT || 5000));
    app.use(express.static(__dirname + '/views'));


    app.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
    });

    urlcomp(app, db);

    // db.close();
})
