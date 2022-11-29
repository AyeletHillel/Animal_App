/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") //import morgan
const methodOverride = require("method-override")
const mongoose = require("mongoose")

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose

const {Schema, model} = mongoose

// make animals schema 
const animalsSchema = new Schema({
    id: Number, 
    species: String,
    extinct: Boolean,
    location: String,
    lifeExpecancy: Number 

})

const Animal = model('Animal', animalsSchema)

/////////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) //logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("your server is running... better catch it.")
})

// index route
app.get("/animals", async (req, res) => {
    const animals = await Animal.find({});
    res.render("animals/index.ejs", { animals });
  });


// Seeding our database
app.get("/animals/seed", (req, res) => {
    // array of starter animals
    const startAnimals = [
        { id: 1, species: "Monkey", extinct: false, location: "Israel", lifeExpecancy: 23},
        { id: 2, species: "Bird", extinct: true, location: "Canada", lifeExpecancy: 6},
        { id: 3, species: "Dog", extinct: false, location: "USA", lifeExpecancy: 14},
        { id: 4, species: "Fish", extinct: false, location: "Panama", lifeExpecancy: 2}

    ]
    // Delete all animals
    Animal.remove({}, (err, data) => {
        // Seed starter animal 
        Animal.create(startAnimals, (err, data) => {
            // send created animals as response to confirm creation
            res.json(data)
        })
    })
})
//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))