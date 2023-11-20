import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Post from "../models/post.js";

const validatePostId = (postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        res.send("Provided resource id is invalid.");
    }
};

const validateFields = [
    body("title", "'title' field (string) must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("text", "'text' field (string) must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("visible")
        .trim()
        .isLength({ min: 1 })
        .withMessage("'visible' field (boolean) must not be empty")
        .escape()
        .isBoolean()
        .withMessage("'visible' field must be a boolean"),
];

export const postsGet = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().exec();
    if (posts !== null) {
        res.json(posts);
    } else {
        res.json({});
    }
});

export const postGet = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    validatePostId(postId);
    const posts = await Post.findById(postId).exec();
    if (posts !== null) {
        res.json(posts);
    } else {
        res.send("Post not found.");
    }
});

export const postCreate = [
    ...validateFields,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            comments: [],
            date_posted: Date.now(),
            visible: req.body.visible,
        });
        if (!errors.isEmpty()) {
            const reducedErrorArray = [];
            errors.array().forEach((error) => {
                reducedErrorArray.push(error.msg);
            });
            res.send(
                `Unable to create new post: ${reducedErrorArray.join(", ")}`
            );
        } else {
            await post.save();
            res.send(`New post successfully created. Post Id: ${post._id}`);
        }
    }),
];

export const postUpdate = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    res.send(`Post UPDATE request, postId: ${postId}`);
});

export const postDelete = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    res.send(`Post DELETE request, postId: ${postId}`);
});
