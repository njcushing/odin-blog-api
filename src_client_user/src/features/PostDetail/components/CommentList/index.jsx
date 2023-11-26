import PropTypes from "prop-types";
import styles from "./index.module.css";

import Comment from "../Comment";

const recurseReply = (comments, depth, maximumDepth) => {
    if (depth > maximumDepth) return null;
    return (
        comments ? comments.map((comment) => {
            return (
                <>
                <li
                    className={styles[`comment-depth-${depth}`]}
                    style={{
                        width: `${Math.max(100 - (5 * depth), 50)}%`,
                        minWidth: `${700 * Math.max(1 - (0.05 * depth), 0.5)}px`,
                    }}
                    key={comment._id}
                >
                    {createComment(comment)}
                </li>
                {
                comment.replies
                    ? recurseReply(comment.replies, depth + 1, maximumDepth)
                    : null
                }
                </>
            );
        }) : null
    );
}

const createComment = (comment) => {
    return (
        <Comment
            _id={comment._id ? comment._id : null}
            firstName={comment.first_name ? comment.first_name : "Error"}
            lastName={comment.last_name ? comment.last_name : "Error"}
            text={comment.text ? comment.text : "Error"}
            datePosted={comment.date_posted ? comment.date_posted : null}
            dateLastUpdated={comment.date_last_updated ? comment.date_last_updated : null}
        />
    );
}

const CommentList = ({
    comments,
    maximumDepth,
}) => {
    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <ul className={styles["comment-list"]}>
                {comments ? recurseReply(comments, 0, maximumDepth) : null}
            </ul>
        </div>
        </div>
    );
}

export default CommentList;