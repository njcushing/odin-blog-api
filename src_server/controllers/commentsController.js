import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import createError from "http-errors";
import passport from "passport";

import Comment from "../models/comment.js";
import Post from "../models/post.js";

import protectedRouteJWT from "../utils/protectedRouteJWT.js";

const validatePostId = (next, postId) => {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return next(createError(400, `Provided postId: ${postId} is invalid.`));
    }
    return true;
};

export const validateDocumentIds = (next, postId, commentId) => {
    const validPostId = mongoose.Types.ObjectId.isValid(postId);
    const validCommentId = mongoose.Types.ObjectId.isValid(commentId);
    if (!validPostId || !validCommentId) {
        return next(
            createError(
                400,
                `${
                    !validPostId && !validCommentId
                        ? `Provided postId: ${postId} and commentId: ${commentId} are both invalid.`
                        : !validPostId
                        ? `Provided postId: ${postId} is invalid.`
                        : `Provided commentId: ${commentId} is invalid.`
                }`
            )
        );
    }
    return true;
};

const commentNotFound = (commentId) => {
    return createError(404, `Specified comment not found at: ${commentId}.`);
};

const postNotFound = (postId) => {
    return createError(404, `Specified post not found at: ${postId}.`);
};

const commentParentPostMismatch = (commentId, postId) => {
    return createError(
        400,
        `Comment exists at: ${commentId}, but it is not in reply to the specified post at: ${postId}.`
    );
};

const successfulRequest = (res, status, message, data) => {
    return res.status(status).send({
        status: status,
        message: message,
        data: data,
    });
};

const validateMandatoryFields = [
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

const validateOptionalFields = [
    body("first_name", "'first_name' field (string) must not be empty")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("last_name", "'last_name' field (string) must not be empty")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("text", "'text' field (string) must not be empty")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .escape(),
];

const compileValidationErrors = (errorsArray) => {
    const reducedErrorArray = [];
    errorsArray.forEach((error) => {
        reducedErrorArray.push(error.msg);
    });
    return reducedErrorArray.join(", ");
};

export const commentsGet = (req, res, next) => {
    passport.authenticate(
        "jwt",
        { session: false },
        async (err, success, options) => {
            const postId = req.params.postId;
            if (!validatePostId(next, postId)) return;
            const post = await Post.findById(postId).limit(10).exec();
            if (post === null) return next(postNotFound(postId));

            // Bad/no auth; do not respond with post info or comments
            if (err || (options && options.message)) {
                if (!post.visible) return next(postNotFound(postId));
            }

            try {
                const comments = post.comments;
                return successfulRequest(res, 200, "Comments found", comments);
            } catch (err) {
                return createError(
                    404,
                    `Comments field not found on specified post at : ${postId}.`
                );
            }
        }
    )(req, res, next);
};

export const commentGet = (req, res, next) => {
    passport.authenticate(
        "jwt",
        { session: false },
        async (err, success, options) => {
            const postId = req.params.postId;
            const commentId = req.params.commentId;
            if (!validateDocumentIds(next, postId, commentId)) return;
            const [post, comment] = await Promise.all([
                Post.findById(postId),
                Comment.findById(commentId),
            ]);
            if (post === null) return next(postNotFound(postId));
            if (comment === null) return next(commentNotFound(commentId));

            // Bad/no auth; do not respond with post info or comments
            if (err || (options && options.message)) {
                if (!post.visible) return next(postNotFound(postId));
            }

            if (
                comment.parent_post === null ||
                comment.parent_post.toString() !== postId
            ) {
                return next(commentParentPostMismatch(commentId, postId));
            } else {
                if (comment.deleted) {
                    const newComment = {
                        ...comment._doc,
                        first_name: "Deleted",
                        last_name: "Deleted",
                        text: "Deleted",
                    };
                    return successfulRequest(
                        res,
                        200,
                        "Comment found",
                        newComment
                    );
                }
                return successfulRequest(res, 200, "Comment found", comment);
            }
        }
    )(req, res, next);
};

export const commentCreate = [
    ...validateMandatoryFields,
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        if (!validatePostId(next, postId)) return;
        const post = await Post.findById(postId).populate("comments").exec();
        if (post === null) return next(postNotFound(postId));

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
            const errorString = compileValidationErrors(errors.array());
            return next(
                createError(400, `Unable to create new comment: ${errorString}`)
            );
        } else {
            const updatedParentPost = await Post.findByIdAndUpdate(postId, {
                $push: { comments: newCommentId },
            });
            if (updatedParentPost === null) {
                return next(
                    createError(
                        404,
                        `Specified post not found at: ${postId}. Comment was not saved.`
                    )
                );
            } else {
                await comment.save();
                return successfulRequest(
                    res,
                    201,
                    `New comment successfully created. Comment Id: ${newCommentId}`,
                    null
                );
            }
        }
    }),
];

export const replyCreate = [
    ...validateMandatoryFields,
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        const parentCommentId = req.params.commentId;
        if (!validateDocumentIds(next, postId, parentCommentId)) return;
        const [post, parentComment] = await Promise.all([
            Post.findById(postId),
            Comment.findById(parentCommentId),
        ]);
        if (post === null) return next(postNotFound(postId));
        if (parentComment === null) {
            return next(commentNotFound(parentCommentId));
        }
        if (
            parentComment.parent_post === null ||
            parentComment.parent_post.toString() !== postId
        ) {
            return next(commentParentPostMismatch(parentCommentId, postId));
        }

        const newCommentId = new mongoose.Types.ObjectId();
        const errors = validationResult(req);
        const comment = new Comment({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            text: req.body.text,
            date_posted: Date.now(),
            replies: [],
            parent_post: postId,
            parent_comment: parentCommentId,
            _id: newCommentId,
        });
        if (!errors.isEmpty()) {
            const errorString = compileValidationErrors(errors.array());
            return next(
                createError(400, `Unable to create new comment: ${errorString}`)
            );
        } else {
            const [updatedParentPost, updatedParentComment] = await Promise.all(
                [
                    Comment.findByIdAndUpdate(parentCommentId, {
                        $push: { replies: newCommentId },
                    }),
                ]
            );
            if (updatedParentPost === null) {
                return next(
                    createError(
                        404,
                        `Specified post not found at: ${postId}. Comment was not saved.`
                    )
                );
            } else if (updatedParentComment === null) {
                return next(
                    createError(
                        404,
                        `Specified comment to reply to not found at: ${parentCommentId}. Comment was not saved.`
                    )
                );
            } else {
                await comment.save();
                return successfulRequest(
                    res,
                    201,
                    `New comment successfully created. Comment Id: ${newCommentId}`,
                    null
                );
            }
        }
    }),
];

export const commentUpdate = [
    protectedRouteJWT,
    ...validateOptionalFields,
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        if (!validateDocumentIds(next, postId, commentId)) return;
        const [post, comment] = await Promise.all([
            Post.findById(postId),
            Comment.findById(commentId),
        ]);
        if (post === null) return next(postNotFound(postId));
        if (comment === null) return next(commentNotFound(commentId));
        if (
            comment.parent_post === null ||
            comment.parent_post.toString() !== postId
        ) {
            return next(commentParentPostMismatch(commentId, postId));
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorString = compileValidationErrors(errors.array());
            return next(
                createError(400, `Unable to create new comment: ${errorString}`)
            );
        } else {
            const updatedComment = await Comment.findByIdAndUpdate(
                commentId,
                {
                    $set: {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        text: req.body.text,
                        date_last_updated: Date.now(),
                    },
                },
                { new: true }
            );
            if (updatedComment === null) {
                return next(commentNotFound(commentId));
            }
            return successfulRequest(
                res,
                200,
                `Comment successfully updated at: ${commentId}.`,
                updatedComment
            );
        }
    }),
];

export const commentDelete = [
    protectedRouteJWT,
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        if (!validateDocumentIds(next, postId, commentId)) return;
        const [post, comment] = await Promise.all([
            Post.findById(postId),
            Comment.findById(commentId),
        ]);
        if (post === null) return next(postNotFound(postId));
        if (comment === null) return next(commentNotFound(commentId));
        if (
            comment.parent_post === null ||
            comment.parent_post.toString() !== postId
        ) {
            return next(commentParentPostMismatch(commentId, postId));
        }

        const deletedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    deleted: true,
                },
            },
            { new: true }
        );
        if (deletedComment === null) {
            return next(commentNotFound(commentId));
        }
        return successfulRequest(
            res,
            200,
            `Comment successfully deleted at: ${commentId}.`,
            deletedComment
        );
    }),
];
