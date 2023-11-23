import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import createError from "http-errors";

import Post from "../models/post.js";
import Comment from "../models/comment.js";

const validatePostId = (req, next, postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return next(createError(400, "Provided resource id is invalid."));
    }
    return true;
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
    if (!validatePostId(res, next, postId)) return;
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
        if (!validatePostId(res, next, postId)) return;
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
                { new: true }
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
    if (!validatePostId(res, next, postId)) return;
    const post = await Post.findById(postId);
    if (post === null) {
        res.send(`Specified post not found at: ${postId}.`);
    }

    /*
        Delete all comments referenced by the post including resursively
        deleting all the replies to each comment
    */
    const commentsToDeleteSet = new Set();
    const commentsToDeleteArray = [];
    const findRepliesToComment = async (commentId) => {
        if (commentsToDeleteSet.has(commentId)) return;
        const comment = await Comment.findById(commentId);
        if (comment === null) return;
        commentsToDeleteSet.add(commentId);
        commentsToDeleteArray.push(commentId);
        await Promise.all(
            comment.replies.map(async (reply) => {
                await findRepliesToComment(reply._id);
            })
        );
    };
    await Promise.all(
        post.comments.map(async (comment) => {
            await findRepliesToComment(comment._id);
        })
    );

    const deletedComments = await Comment.deleteMany({
        _id: { $in: commentsToDeleteArray },
    });
    const deletedCount = deletedComments.deletedCount;

    const deletedPost = await Post.findByIdAndDelete(postId);

    res.send(`
        ${
            deletedPost === null
                ? `Specified post not found at: ${postId}. ${deletedCount} comments deleted${
                      deletedCount === 0
                          ? `.`
                          : ` (post was found in initial query but may have been deleted by another source prior to deletion by this process).`
                  }`
                : `Post successfully deleted at: ${postId}. ${deletedCount} comments deleted.`
        }
    `);
});
