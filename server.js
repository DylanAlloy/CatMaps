const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const path = require("path");

// Connect to MongoDB
mongoose.connect("mongodb://localhost/catmap", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define schema for photo data
const photoSchema = new mongoose.Schema({
    imagePath: String,
    latitude: Number,
    longitude: Number,
    date: { type: Date, default: Date.now },
});

app.set("view engine", "hbs");

// Route for homepage
app.get("/", (req, res) => {
    res.render("index");
});

// Define model for photo data
const Photo = mongoose.model("Photo", photoSchema);

// Route for uploading photos
app.post("/upload", upload.single("photo"), (req, res) => {
    // Create new photo object with data from request
    const newPhoto = new Photo({
        imagePath: req.file.path,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    });

    // Save new photo object to database
    newPhoto.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
});


// Route for getting previous photos
app.get("/photos", (req, res) => {
    // Find all photos in database and return as JSON
    Photo.find({})
        .then((photos) => {
            res.json(photos);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
});


// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
