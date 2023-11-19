import express from "express";
const router = express.Router();

import * as controller from "../controllers/commentsController.js";

router.get("/", controller.commentsGet);
router.get("/:commentId", controller.commentGet);
router.post("/", controller.commentCreate);
router.put("/:commentId", controller.commentUpdate);
router.delete("/:commentId", controller.commentDelete);

export default router;
