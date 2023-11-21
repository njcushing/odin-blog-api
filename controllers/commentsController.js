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
                validPostId && validCommentId
                    ? `Provided post id and comment id are both invalid.`
                    : validPostId
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
    res.send("Comments GET request");
});

export const commentGet = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    res.send(`Comment GET request, commentId: ${commentId}`);
});

export const commentCreate = asyncHandler(async (req, res, next) => {
    res.send("Comment CREATE request");
});

export const commentUpdate = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    res.send(`Comment UPDATE request, commentId: ${commentId}`);
});

export const commentDelete = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    res.send(`Comment DELETE request, commentId: ${commentId}`);
});
