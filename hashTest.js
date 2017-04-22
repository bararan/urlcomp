var crypto = require("crypto");

for (var i = 0; i < 10; i++) {
    console.log(crypto.randomBytes(3).toString("hex"));
}