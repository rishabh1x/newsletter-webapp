const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    var filePath = __dirname + "/signup.html";
    res.sendFile(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
});

app.post("/", (req, res) => {
    let requestBody = req.body;
    var firstName = requestBody.fname;
    var lastName = requestBody.lname;
    var userEmail = requestBody.uemail;

    const data = {
        members: [
            {
                email_address: userEmail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    const url = "https://us20.api.mailchimp.com/3.0/lists/9a4c5fca3b";
    const options = {
        method: "POST",
        auth: "rishabh:3aefbca8fc3699e3859f07d249769c28-us20"
    };

    const request = https.request(url, options, (apiRes) => {
        apiRes.on("data", (data) => {
            if (apiRes.statusCode === 200) {
                let responseData = JSON.parse(data);
                if (responseData) {
                    var errorValue = responseData.error_count;
                    if (errorValue === 0) {
                        res.sendFile(__dirname + "/success.html");
                    }
                    else {
                        res.sendFile(__dirname + "/failure.html");
                    }
                }
                else {
                    res.sendFile(__dirname + "/failure.html");
                }
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.post("/success", (req, res) => {
    res.redirect("/");
});

app.listen(3000, () => {
    console.log('server is running on port 3000');
});