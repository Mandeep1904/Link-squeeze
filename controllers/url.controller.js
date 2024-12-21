import { nanoid } from 'nanoid'
import URL from "../models/url.model.js";

const handleGenerateURL = async (req, res) => {
    const { url, length } = req.body
    if (!url || !length) {
        return res.status(400).json({ "error": "URL & length are required" })
    }

    let urlEntry = await URL.findOne({ redirectURL: url })

    if (urlEntry) {
        res.render("index", { shortURL: urlEntry.shortURL });
    } else {
        const shortURL = nanoid(Number(length));
        await URL.create({
            shortURL: shortURL,
            redirectURL: url,
            visitedHistory: []
        })
        res.render("index", { shortURL: shortURL })
    }
}

const handleGetAnalytics = async (req, res) => {
    try {
        const result = await URL.find({});
            res.render("AllURLsAnalytics", { urls: result });
        } else {
            res.render("Error", { Error: "No Short URLs created yet" });
        }
    } catch (error) {
        console.error(error);
        res.render("Error", { Error: "An error occurred while fetching URLs." });
    }
};

const handleDeleteURL = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await URL.findByIdAndDelete(id);

        if (result) {
            res.status(200).send({ success: true });
        } else {
            res.status(404).send({ success: false, message: "URL not found" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Server error" });
    }
};

export { handleGenerateURL, handleGetAnalytics, handleDeleteURL }