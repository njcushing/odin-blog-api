import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";

import { DateTime } from "luxon";
import mongoose from "mongoose";

import MaterialSymbolsButton from "@/components/MaterialSymbolsButton";
import CommentForm from "../CommentForm";

var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

const formatDate = (dateString) => {
    if (dateString && isDate(dateString)) {
        return DateTime.fromJSDate(new Date(dateString)).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS
        );
    }
    return "Unknown";
}

const submitReply = async (e, postId, commentId) => {
    e.currentTarget.blur();
    e.preventDefault(); // Prevent form submission; handle manually

    const formData = new FormData(e.target.form);
    const formDataJSON = JSON.stringify(Object.fromEntries(formData));

    await fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: formDataJSON,
    })
        .then((response) => {
            if (response.status >= 400) {
                throw new Error(`Request error: status ${response.status}`);
            } else {
                return response.json();
            }
        })
        .then((response) => {
            // Successful response - refresh page
            location.reload(true);
        })
        .catch((error) => {
            throw new Error(error);
        })
}

const Comment = ({
    postId,
    commentId,
    depth,
    maximumDepth,
    canReply,
}) => {
    const [comment, setComment] = useState(null);
    const [replying, setReplying] = useState(false);

    useEffect(() => {
        if (!mongoose.Types.ObjectId.isValid(postId)) return;
        if (!mongoose.Types.ObjectId.isValid(commentId)) return;
        fetch(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
            method: "GET",
            mode: "cors",
            headers: {
                // "Content-Type": "application/json",
                "authorization": ""
            }
        })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error(`Request error: status ${response.status}`);
                } else {
                    return response.json();
                }
            })
            .then((response) => setComment(response.data))
            .catch((error) => {
                throw new Error(error);
            })
    }, []);

    return (
        <>
        {comment
        ?   <>
            <li className={styles["wrapper"]}
                style={{
                    width: `${Math.max(100 - (5 * depth), 50)}%`,
                    minWidth: `${700 * Math.max(1 - (0.05 * depth), 0.5)}px`,
                }}
            >
                <div className={styles["container"]}>
                    <div className={styles["name-and-text"]}>
                        <h3 className={styles["name"]}>{`${comment.first_name} ${comment.last_name}`}</h3>
                        <p className={styles["text"]}>{comment.text}</p>
                    </div>
                    <div className={styles["dates"]}>
                        <h5 className={styles["date-string"]}>Date posted: {formatDate(comment.date_posted)}</h5>
                        <h5 className={styles["date-string"]}>Date last updated: {formatDate(comment.date_last_updated)}</h5>
                    </div>
                    <div className={styles["links"]}>
                        <div className={styles["reply-button"]}>
                            Reply
                            <MaterialSymbolsButton
                                aria-label="Reply to comment"
                                text="reply"
                                onClickHandler={() => {
                                    if (canReply) setReplying(true); 
                                }}
                                sizeRem={1.8}
                            />
                        </div>
                        {depth >= maximumDepth
                        ?   <a
                                className={styles["view-more-replies-anchor"]}
                                aria-label="View more replies"
                                href={null}
                            >View more replies...</a>
                        :   null}
                    </div>
                    {replying
                    ?   <div className={styles["comment-form"]}>
                            <CommentForm
                                onCloseHandler={() => { setReplying(false); }}
                                onSubmitHandler={(e) => submitReply(e, postId, commentId)}
                            />
                        </div>
                    :   null}
                </div>
            </li>
            {depth < maximumDepth
            ?   comment.replies.map((reply) => {
                    return (
                        <Comment
                            postId={postId}
                            commentId={reply}
                            depth={depth + 1}
                            maximumDepth={maximumDepth}
                            canReply={true}
                        />
                    );
                })
            :   null}
            </>
        :   null}
        </>
    );
}

Comment.propTypes = {
    postId: PropTypes.string.isRequired,
    commentId: PropTypes.string.isRequired,
    depth: function(props, propName, componentName) {
        if (!Number.isInteger(props[propName])) {
            return new Error(`Invalid prop '${propName}' supplied to
            component '${componentName}'. Must be an integer.`);
        }
    },
    maximumDepth: function(props, propName, componentName) {
        if (!Number.isInteger(props[propName])) {
            return new Error(`Invalid prop '${propName}' supplied to
            component '${componentName}'. Must be an integer.`);
        }
    },
    canReply: PropTypes.bool,
}

Comment.defaultProps = {
    canReply: false,
}

export default Comment;