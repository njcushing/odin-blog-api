import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./index.module.css";

import Comment from "./components/Comment";

const maximumDepth = 4;

const recurseReply = (comments, depth) => {
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
                {comment.replies ? recurseReply(comment.replies, depth + 1) : null}
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

const PostDetail = () => {
    const { postId } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/posts/${postId}`, {
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
            .then((response) => setPost(response.data))
            .catch((error) => console.log(error))
    }, []);

    useEffect(() => {
        fetch(`http://localhost:3000/posts/${postId}/comments`, {
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
            .then((response) => setComments(response.data))
            .catch((error) => console.log(error))
    }, []);

    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <div className={styles["post-information"]}>
                <h1 className={styles["title"]}>{post ? post.title ? post.title : "" : ""}</h1>
                <p className={styles["text"]}>{post ? post.text ? post.text : "" : ""}</p>
                <div className={styles["comment-list-container"]}> 
                    <ul className={styles["comment-list"]}>
                        {comments ? recurseReply(comments, 0) : null}
                    </ul>
                </div>
            </div>
        </div>
        </div>
    );
}

export default PostDetail;