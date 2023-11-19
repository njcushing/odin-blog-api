import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    first_name: {
        type: String,
        maxLength: 30,
        required: true,
    },
    last_name: {
        type: String,
        maxLength: 30,
        required: true,
    },
    text: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 1000,
        required: true,
    },
    date_posted: { type: Date, default: Date.now },
    isReply: { type: Boolean },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

export default mongoose.model("Comment", CommentSchema);
