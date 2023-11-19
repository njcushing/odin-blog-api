import express from "express";
const router = express.Router();

import * as controller from "../controllers/postsController.js";

router.get("/", controller.postsGet);

export default router;
