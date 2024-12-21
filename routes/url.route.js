import express from "express";
import { handleGenerateURL, handleGetAnalytics, handleDeleteURL } from "../controllers/url.controller.js";

const router = express.Router();

router.post("/", handleGenerateURL);
router.get("/analytics", handleGetAnalytics);
router.delete('/delete-url/:id', handleDeleteURL);

export default router;