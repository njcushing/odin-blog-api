import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";

import { DateTime } from "luxon";

import mongoose from "mongoose";
import MaterialSymbolsAnchor from "@/components/MaterialSymbolsAnchor";

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

const Comment = ({
    postId,
    commentId,
    depth,
    maximumDepth,
}) => {
    const [comment, setComment] = useState(null);

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
            .catch((error) => console.log(error))
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
                    <h3 className={styles["name"]}>{`${comment.first_name} ${comment.last_name}`}</h3>
                    <p className={styles["text"]}>{comment.text}</p>
                    <div className={styles["dates"]}>
                        <h5 className={styles["date-string"]}>Date posted: {formatDate(comment.date_posted)}</h5>
                        <h5 className={styles["date-string"]}>Date last updated: {formatDate(comment.date_last_updated)}</h5>
                    </div>
                </div>
            </li>
            {depth <= maximumDepth
            ?   comment.replies.map((reply) => {
                    return (
                        <Comment
                            postId={postId}
                            commentId={reply}
                            depth={depth + 1}
                            maximumDepth={maximumDepth}
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
}

export default Comment;