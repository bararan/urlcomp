const validUrl = require("valid-url");
const crypto = require("crypto");

module.exports = function(app, db) {
    app.get("/", function(req, res) {
        res.render();
    });

    app.get("/:urlExt", function(req, res) {
        if (req.params.urlExt == "" || req.params.urlExt == "favicon.ico") {
            return;
        }
        const collection = db.collection("shortURLs");
        collection.find({"urlExt": req.params.urlExt}, {"_id": 0, "targetURL": 1})
                            .toArray(function(err, target) {
                                if (err) res.end("URL Not Found!");
                                if (target.length == 0) {
                                    res.send("The requested URL could not be found. Please verify and try again.");
                                } else {
                                    console.log("Redirecting to: " + target[0].targetURL)
                                    res.redirect("http://" + target[0].targetURL);
                                }
                            });
    });

    app.get("/new/https?://:url", function(req, res) {
        if (!validUrl.isWebUri("http://" + req.params.url)) {
            res.send("Please enter a valid URL and try again.");
        } else {
            let collection = db.collection("shortURLs");
            // We need to check here if the URL is already in the DB and create a new entry only if it isn't
            collection.find({"targetURL": req.params.url},{"_id": 0})
                        .toArray(function(err, docs) {
                            if (err) throw err;//Do we get an error if the URL isn't in the DB? If not change this bit!
                            else if (docs.length == 0) {
                                const urlExt = crypto.randomBytes(3).toString("hex");
                                const obj = {
                                    "urlExt": urlExt,
                                    "targetURL": req.params.url
                                };
                                res.json(obj);
                                console.log("Adding to DB: " + JSON.stringify(obj));
                                collection.insert(obj);
                            } else {
                                console.log("Found " + docs.length + " docs!")
                                res.json(docs[0]);
                            }
                        });
        };
    });
    app.get("/new/*", function(req, res) {
        res.send("You have entered an invalid URL. Please correct and try again!")
    })
}
