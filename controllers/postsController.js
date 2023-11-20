import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import Post from "../models/post.js";

const validatePostId = (res, postId) => {
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

const sendValidationErrors = (res, errorsArray) => {
    const reducedErrorArray = [];
    errorsArray.forEach((error) => {
        reducedErrorArray.push(error.msg);
    });
    res.send(`Unable to create new post: ${reducedErrorArray.join(", ")}`);
};

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
    validatePostId(res, postId);
    const post = await Post.findById(postId).exec();
    if (post === null) {
        res.send(`Specified post not found at: ${postId}.`);
    } else {
        res.json(post);
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
            date_last_updated: Date.now(),
            visible: req.body.visible,
        });
        if (!errors.isEmpty()) {
            sendValidationErrors(res, errors.array());
        } else {
            await post.save();
            res.send(`New post successfully created. Post Id: ${post._id}`);
        }
    }),
];

export const postUpdate = [
    ...validateFields,
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        validatePostId(res, postId);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            sendValidationErrors(res, errors.array());
        } else {
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $set: {
                        title: req.body.title,
                        text: req.body.text,
                        date_last_updated: Date.now(),
                        visible: req.body.visible,
                    },
                },
                {}
            );
            if (updatedPost === null) {
                res.send(`Specified post not found at: ${postId}.`);
            }
            res.send(
                `Post successfully updated at: ${postId}. New post details: ${updatedPost}`
            );
        }
    }),
];

export const postDelete = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    res.send(`Post DELETE request, postId: ${postId}`);
});
