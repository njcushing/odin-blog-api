import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user.js";

const compileValidationErrors = (errorsArray) => {
    const reducedErrorArray = [];
    errorsArray.forEach((error) => {
        reducedErrorArray.push(error.msg);
    });
    return reducedErrorArray.join(", ");
};

export const loginPost = [
    body("username", "'username' field must be present and filled in request")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "'password' field must be present and filled in request")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorString = compileValidationErrors(errors.array());
            return next(
                createError(401, `Invalid login attempt: ${errorString}`)
            );
        } else {
            const { username, password } = req.body;
            const user = await User.findOne({ username: username });
            if (!user) {
                return next(
                    createError(
                        401,
                        `Invalid login attempt: Incorrect user credentials.`
                    )
                );
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return next(
                    createError(
                        401,
                        `Invalid login attempt: Incorrect user credentials.`
                    )
                );
            }
            jwt.sign(
                { user: req.user },
                process.env.AUTH_SECRET_KEY,
                { expiresIn: "600s" },
                (err, token) => {
                    if (err) {
                        return next(
                            createError(401, `Invalid login attempt: ${err}`)
                        );
                    } else {
                        res.status(200).send({
                            status: 200,
                            message: "Successfully logged in!",
                            data: { token: token },
                        });
                    }
                }
            );
        }
    }),
];
