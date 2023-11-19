import asyncHandler from "express-async-handler";

export const postsGet = asyncHandler(async (req, res, next) => {
    res.send("Posts GET request");
});

export const postGet = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    res.send(`Post GET request, postId: ${postId}`);
});

export const postCreate = asyncHandler(async (req, res, next) => {
    res.send("Post CREATE request");
});

export const postUpdate = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    res.send(`Post UPDATE request, postId: ${postId}`);
});

export const postDelete = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    res.send(`Post DELETE request, postId: ${postId}`);
});
