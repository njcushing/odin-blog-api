import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./index.module.css";

import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";

const PostDetail = ({
    canReply,
}) => {
    const { postId } = useParams();

    const [post, setPost] = useState(null);
    const [replying, setReplying] = useState(false);
    const [submissionErrors, setSubmissionErrors] = useState([]);

    const submitComment = useCallback(async (e) => {
        e.currentTarget.blur();
        e.preventDefault(); // Prevent form submission; handle manually
    
        const formData = new FormData(e.target.form);
        const formFields = Object.fromEntries(formData);
        const formDataJSON = JSON.stringify(formFields);

        // Client-side validation
        const errors = [];
        if (formFields.first_name.length < 1) errors.push("Please fill in the First Name field.");
        if (formFields.last_name.length < 1) errors.push("Please fill in the Last Name field.");
        if (formFields.text.length < 1) errors.push("Please fill in the Your Comment field.");
        if (errors.length > 0) {
            setSubmissionErrors(errors);
            return;
        }

        // POST comment
        await fetch(`http://localhost:3000/posts/${postId}/comments`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: formDataJSON,
        })
            .then(async (response) => {
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
    }, []);

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
                    {replying
                    ?   <div className={styles["comment-form-container"]}>
                            <div className={styles["comment-form"]}>
                                <CommentForm
                                    onCloseHandler={() => {
                                        if (replying) setSubmissionErrors([]);
                                        setReplying(false);
                                    }}
                                    onSubmitHandler={(e) => submitComment(e)}
                                    submissionErrors={submissionErrors}
                                />
                            </div>
                        </div>
                    :   <button
                            className={styles["reply-button"]}
                            onClick={(e) => {
                                e.currentTarget.blur();
                                e.preventDefault();
                                setReplying(true);
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.blur();
                            }}
                        >Leave a Comment</button>}
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