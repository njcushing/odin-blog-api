import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    text: {
        type: String,
        trim: true,
        required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    date_posted: { type: Date, default: Date.now },
    date_last_updated: { type: Date, default: Date.now },
    visible: { type: Boolean, required: true, default: true },
});

PostSchema.virtual("date_posted_formatted").get(function () {
    return this.date_posted
        ? DateTime.fromJSDate(this.date_posted).toLocaleString(
              DateTime.DATETIME_SHORT_WITH_SECONDS
          )
        : null;
});

export default mongoose.model("Post", PostSchema);
