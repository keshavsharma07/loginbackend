const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;
app.use(cors());


var uniqueValidator = require('mongoose-unique-validator');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/details");


const router = express.Router();

const connection = mongoose.connection;

connection.once("open", function () {
    console.log("Connection with MongoDB was successful");
});

app.use("/", router);



var schema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String

});
schema.plugin(uniqueValidator);
var detail = mongoose.model("detail", schema);

app.post("/postData", function (req, res) {

    new detail({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).save(function (err, doc) {
        if (err) res.send('Failed');
        else res.send('Successfully inserted!');
    });





});


app.post("/login", (req, res) => {
    detail.findOne({ email: req.body.email,password:req.body.password}, function (err, user) {

        if (err || !user) {
            res.send("Wrong Credentials");
        }
        // else if(! req.body.email &&  req.body.password)
        // {
        //     res.send("Incorrect PAssword!!!");
        // }
      
        else{
            res.send("Login Credentials Correct");
        }
    }
    )
        

});


router.route("/getData").get(function (req, res) {
    detail.find({}, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(result);
        }

    });
});

app.listen(PORT, () => {
    console.log("Server is running at " + PORT);
});

