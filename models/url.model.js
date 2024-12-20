import mongoose from "mongoose"

const urlSchema = mongoose.Schema({
    shortURL: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true
    },
    visitedHistory: [{ timestamp: { type: Number } }]

}, { timestamps: true })

const URL = mongoose.model("Url", urlSchema);

export default URL;
