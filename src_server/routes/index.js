import express from "express";
const router = express.Router();

import posts from "./posts.js";
import comments from "./comments.js";
import login from "./login.js";

router.get("/", (req, res) => {
    res.redirect("/posts");
});

export { router as index, posts, comments, login };
