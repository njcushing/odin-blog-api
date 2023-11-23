import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import createError from "http-errors";

import Post from "../models/post.js";
import Comment from "../models/comment.js";

const validatePostId = (next, postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return next(createError(400, `Provided postId: ${postId} is invalid.`));
    }
    return true;
};

const compileValidationErrors = (errorsArray) => {
    const reducedErrorArray = [];
    errorsArray.forEach((error) => {
        reducedErrorArray.push(error.msg);
    });
    return reducedErrorArray.join(", ");
};

const postNotFound = (postId) => {
    return createError(404, `Specified post not found at: ${postId}.`);
};

const successfulRequest = (res, status, message, data) => {
    return res.status(status).send({
        status: status,
        message: message,
        data: data,
    });
};

export const postsGet = asyncHandler(async (req, res, next) => {
    const posts = await Post.find().exec();
    if (posts === null) {
        return createError(404, `No posts found.`);
    } else {
        return successfulRequest(res, 200, "Posts found", posts);
    }
});

export const postGet = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    if (!validatePostId(next, postId)) return;
    const post = await Post.findById(postId).exec();
    if (post === null) {
        return next(postNotFound(postId));
    } else {
        return successfulRequest(res, 200, "Post found", post);
    }
});

export const postCreate = [
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
            const errorString = compileValidationErrors(errors.array());
            return next(
                createError(400, `Unable to create new post: ${errorString}`)
            );
        } else {
            await post.save();
            return successfulRequest(
                res,
                201,
                `New post successfully created. Post Id: ${post._id}`,
                null
            );
        }
    }),
];

export const postUpdate = [
    body("title", "'title' field (string) must not be empty")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("text", "'text' field (string) must not be empty")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("visible")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage("'visible' field (boolean) must not be empty")
        .escape()
        .isBoolean()
        .withMessage("'visible' field must be a boolean"),
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        if (!validatePostId(next, postId)) return;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorString = compileValidationErrors(errors.array());
            return next(
                createError(400, `Unable to update post: ${errorString}`)
            );
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
            if (updatedPost === null) return next(postNotFound(postId));
            return successfulRequest(
                res,
                200,
                `Post successfully updated at: ${postId}.`,
                updatedPost
            );
        }
    }),
];

export const postDelete = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    if (!validatePostId(next, postId)) return;
    const post = await Post.findById(postId);
    if (post === null) return next(postNotFound(postId));

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

    if (deletedPost === null) {
        return next(
            createError(
                404,
                `Specified post not found at: ${postId}. ${deletedCount} comments deleted${
                    deletedCount === 0
                        ? `.`
                        : ` (post was found in initial query but may have been deleted by another source prior to deletion by this process).`
                }`
            )
        );
    } else {
        return successfulRequest(
            res,
            200,
            `Post successfully deleted at: ${postId}. ${deletedCount} comments deleted.`,
            null
        );
    }
});
