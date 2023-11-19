import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
});

export default mongoose.model("User", UserSchema);
