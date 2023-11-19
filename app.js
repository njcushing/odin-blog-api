import dotenv from "dotenv";
dotenv.config();

import createError from "http-errors";
import express from "express";
import passport from "passport";
import passportJWT from "passport-jwt";
const JWTStrategy = passportJWT.Strategy;
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import path from "path";
import logger from "morgan";
import RateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";

// Set up mongoose connection
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI || null;
main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

var app = express();

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});
app.use(limiter);

app.use(helmet());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(compression());

import * as routes from "./routes/index.js";

app.use("/posts", routes.posts);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

export default app;
