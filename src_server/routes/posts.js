import express from "express";
const router = express.Router();

import * as controller from "../controllers/postsController.js";

router.get("/", controller.postsGet);
router.get("/:postId", controller.postGet);
router.post("/", controller.postCreate);
router.put("/:postId", controller.postUpdate);
router.delete("/:postId", controller.postDelete);

export default router;
