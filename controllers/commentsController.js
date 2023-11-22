import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Comment from "../models/comment.js";
import Post from "../models/post.js";

const validateCommentId = (res, commentId) => {
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        res.send("Provided comment id is invalid.");
    }
};

const validatePostId = (res, postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.send("Provided post id is invalid.");
    }
};

export const validateDocumentIds = (res, postId, commentId) => {
    const validPostId = mongoose.Types.ObjectId.isValid(postId);
    const validCommentId = mongoose.Types.ObjectId.isValid(commentId);
    if (!validPostId || !validCommentId) {
        res.send(
            `${
                !validPostId && !validCommentId
                    ? `Provided post id and comment id are both invalid.`
                    : !validPostId
                    ? "Provided post id is invalid."
                    : "Provided comment id is invalid."
            }`
        );
    }
};

const validateFields = [
    body("first_name", "'first_name' field (string) must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("last_name", "'last_name' field (string) must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("text", "'text' field (string) must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
];

const sendValidationErrors = (res, errorsArray) => {
    const reducedErrorArray = [];
    errorsArray.forEach((error) => {
        reducedErrorArray.push(error.msg);
    });
    res.send(`Unable to create new comment: ${reducedErrorArray.join(", ")}`);
};

export const commentsGet = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    validatePostId(res, postId);
    const post = await Post.findById(postId).populate("comments").exec();
    if (post === null) {
        res.send(`Specified post not found at: ${postId}.`);
    } else {
        try {
            const comments = post.comments;
            res.json(comments);
        } catch (err) {
            res.send(
                `Post found at: ${postId}, but 'comments' field was not found on the returned document.`
            );
        }
    }
});

export const commentGet = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    validateDocumentIds(res, postId, commentId);
    const post = await Post.findById(postId);
    const comment = await Comment.findById(commentId);
    if (post === null) {
        res.send(`Specified post not found at: ${postId}.`);
    }
    if (comment === null) {
        res.send(`Specified comment not found at: ${commentId}.`);
    } else {
        if (comment.parent_post !== postId) {
            res.send(
                `Comment exists, but it is not in reply to the specified post.`
            );
        } else {
            res.json(comment);
        }
    }
});

export const commentCreate = [
    ...validateFields,
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        validatePostId(res, postId);
        const post = await Post.findById(postId);
        if (post === null) {
            res.send(`Specified post not found at: ${postId}.`);
        } else {
            const newCommentId = new mongoose.Types.ObjectId();
            const errors = validationResult(req);
            const comment = new Comment({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                text: req.body.text,
                date_posted: Date.now(),
                replies: [],
                parent_post: postId,
                parent_comment: null,
                _id: newCommentId,
            });
            if (!errors.isEmpty()) {
                sendValidationErrors(res, errors.array());
            } else {
                await Promise.all([
                    comment.save(),
                    Post.findByIdAndUpdate(postId, {
                        $push: { comments: newCommentId },
                    }),
                ]);
                res.send(
                    `New comment successfully created. Post Id: ${comment._id}`
                );
            }
        }
    }),
];

export const replyCreate = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    res.send(`Comment POST request, commentId: ${commentId}`);
});

export const commentUpdate = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    res.send(`Comment UPDATE request, commentId: ${commentId}`);
});

export const commentDelete = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    res.send(`Comment DELETE request, commentId: ${commentId}`);
});
