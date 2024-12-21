import express from 'express';
import dotenv from "dotenv";
import connectDB from './connectDB.js';
import URL from './models/url.model.js';
import urlRouter from "./routes/url.route.js";
import mongoose from "mongoose"

const port = process.env.PORT || 5000;

dotenv.config()

const app = express();

app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.json())

// routes
app.get("/", (req, res) => {
    res.render("index", { shortURL: null })
})

app.use("/url", urlRouter)

app.get("/:shortURL", async (req, res) => {
    const shortURL = req.params.shortURL;
    const entry = await URL.findOneAndUpdate({ shortURL }, {
        $push: {
            visitedHistory: { timestamp: Date.now() }
        }
    });

    if (!entry) {
        // If entry is not found, handle it gracefully
        return res.status(404).render("Error", { Error: "URL not found" });
    }

    res.redirect(entry.redirectURL);
});


// Connecting to the database
connectDB();

mongoose.connection.on("open", () => {
    app.listen(port, () => {
        console.log(`Server listening on port : ${port}`);
    });
})