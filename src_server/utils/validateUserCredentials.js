import bcrypt from "bcryptjs";

import User from "../models/user.js";

const validateUserCredentials = async (username, password) => {
    const user = await User.findOne({ username: username });
    if (!user) return [false, null, { message: "Incorrect username." }];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return [false, null, { message: "Incorrect password." }];
    user.password = password; // We do not want the returned password to be the hashed version
    return [true, user, null];
};

export default validateUserCredentials;
