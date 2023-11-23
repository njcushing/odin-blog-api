import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

export const loginPost = asyncHandler(async (req, res, next) => {
    res.send("/login POST request");
});
