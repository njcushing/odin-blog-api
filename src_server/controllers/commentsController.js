import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import createError from "http-errors";

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

export const commentsGet = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    if (!validatePostId(next, postId)) return;
    const post = await Post.findById(postId).populate("comments").exec();
    if (post === null) return next(postNotFound(postId));

    try {
        const comments = post.comments;
        return successfulRequest(res, 200, "Comments found", comments);
    } catch (err) {
        return createError(
            404,
            `Comments field not found on specified post at : ${postId}.`
        );
    }
});

export const commentGet = asyncHandler(async (req, res, next) => {
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
    } else {
        return successfulRequest(res, 200, "Comment found", comment);
    }
});

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
            parentCommentId.parent_post === null ||
            parentCommentId.parent_post.toString() !== postId
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
                    Post.findByIdAndUpdate(postId, {
                        $push: { comments: newCommentId },
                    }),
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

        // Resursively delete all the replies to the comment
        const commentsToDeleteSet = new Set();
        const commentsToDeleteArray = [];
        const findRepliesToComment = async (commentId) => {
            if (commentsToDeleteSet.has(commentId)) return;
            // Making repeated db queries instead of one more broad query is likely
            // horribly performant when scaled up, but it works for our small site
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
            comment.replies.map(async (comment) => {
                await findRepliesToComment(comment._id);
            })
        );

        const deletedComments = await Comment.deleteMany({
            _id: { $in: commentsToDeleteArray },
        });
        const deletedCount = deletedComments.deletedCount + 1;

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (deletedComment === null) {
            return next(
                createError(
                    404,
                    `Specified comment not found at: ${commentId}. ${deletedCount} comments deleted${
                        deletedCount === 0
                            ? `.`
                            : ` (comment was found in initial query but may have been deleted by another source prior to deletion by this process).`
                    }`
                )
            );
        } else {
            return successfulRequest(
                res,
                200,
                `Comment successfully deleted at: ${commentId}. ${deletedCount} comments deleted.`,
                null
            );
        }
    }),
];
