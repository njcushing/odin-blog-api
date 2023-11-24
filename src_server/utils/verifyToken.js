import createError from "http-errors";

export default verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader === undefined) {
        return next(
            createError(401, "You are not authorised to perform this request.")
        );
    }
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
};
