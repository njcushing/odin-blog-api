import express from "express";
const router = express.Router();

import * as controller from "../controllers/commentsController.js";

router.get("/:postId/comments/", controller.commentsGet);
router.get("/:postId/comments/:commentId", controller.commentGet);
router.post("/:postId/comments/", controller.commentCreate);
router.put("/:postId/comments/:commentId", controller.commentUpdate);
router.delete("/:postId/comments/:commentId", controller.commentDelete);

export default router;
