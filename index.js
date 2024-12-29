import express from 'express';
import dotenv from "dotenv";
import connectDB from './connectDB.js';
import URL from './models/url.model.js';
import urlRouter from "./routes/url.route.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import cors from 'cors';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;

dotenv.config()

const app = express();

app.use(express.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")
app.use(bodyParser.json());
app.use(express.json())
app.use(cors());
// Middleware to protect routes
const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  
    try {
      const decoded = jwt.verify(token, 'secret_key');
      req.user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  };
  
// routes
app.get("/", (req, res) => {
    res.render("index", { shortURL: null })
})

app.use("/url", protect ,urlRouter)

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

app.listen(port, () => {
    console.log(`Server listening on port : ${port}`);
});