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
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    parent_post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    },
    replying_to_comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
});

CommentSchema.virtual("date_posted_formatted").get(function () {
    return this.date_posted
        ? DateTime.fromJSDate(this.date_posted).toLocaleString(
              DateTime.DATETIME_SHORT_WITH_SECONDS
          )
        : null;
});

export default mongoose.model("Comment", CommentSchema);
