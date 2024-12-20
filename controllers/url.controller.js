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
    const shortURL = req.params.shortURL;
    const result = await URL.findOne({ shortURL })
    if(result){
        return res.render("Analytics", { TotalCounts: result.visitedHistory.length, analytics: result.visitedHistory, shortURLName: shortURL })
    }else{
        return res.render("Error", { Error: "This Short URL doesn't exist"})
    }
}

export { handleGenerateURL, handleGetAnalytics }