import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./index.module.css";

import CommentList from "./components/CommentList";

const PostDetail = ({
    canReply,
}) => {
    const { postId } = useParams();

    const [post, setPost] = useState(null);

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

    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <button
                className={styles["return-button"]}
                onClick={(e) => {
                    e.currentTarget.blur();
                    e.preventDefault();
                    window.location.href = "/posts";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.blur();
                }}
            >Return to Post List</button>
            <div className={styles["post-information"]}>
                {post
                ?   <>
                    <h1 className={styles["title"]}>{
                        post.title ? post.title : "This post has no title."
                    }</h1>
                    <p className={styles["text"]}>{
                        post.text ? post.text : "This post has no description."
                    }</p>
                    {post.comments ? post.comments.length > 0
                    ? <CommentList
                        postId={postId}
                        commentIds={post.comments}
                        maximumDepth={4}
                        />
                    : <h4>Be the first to comment on this post!</h4> : null}
                    </>
                : null }
            </div>
        </div>
        </div>
    );
}

PostDetail.propTypes = {
    canReply: PropTypes.bool,
}

PostDetail.defaultProps = {
    canReply: false,
}

export default PostDetail;