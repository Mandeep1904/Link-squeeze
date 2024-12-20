import express from "express";
import { handleGenerateURL, handleGetAnalytics } from "../controllers/url.controller.js";

const router = express.Router();

router.post("/", handleGenerateURL);
router.get("/analytics/:shortURL", handleGetAnalytics);

export default router;