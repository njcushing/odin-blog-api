import asyncHandler from "express-async-handler";

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
