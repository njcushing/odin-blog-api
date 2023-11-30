import { useState, useEffect, useCallback } from "react";
import styles from "./index.module.css";

import Post from "./components/Post";
import PostForm from "./components/PostForm";

const PostList = () => {
    const [postList, setPostList] = useState(null);
    const [creating, setCreating] = useState(false);
    const [submissionErrors, setSubmissionErrors] = useState([]);

    const createPost = useCallback(async (e) => {
        e.currentTarget.blur();
        e.preventDefault(); // Prevent form submission; handle manually
    
        const formData = new FormData(e.target.form);
        const formFields = Object.fromEntries(formData);

        // Client-side validation
        const errors = [];
        if (formFields.title.length < 1) errors.push("Please fill in the Title field.");
        if (formFields.text.length < 1) errors.push("Please fill in the Text field.");
        if (formFields.visible === "on") {
            formFields.visible = true;
        } else {
            formFields.visible = false;
        }
        if (errors.length > 0) {
            setSubmissionErrors(errors);
            return;
        }

        const formDataJSON = JSON.stringify(formFields);

        // POST post
        await fetch(`${process.env.SERVER_DOMAIN}/posts`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem("authToken"),
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
    }, []);

    useEffect(() => {
        fetch(`${process.env.SERVER_DOMAIN}/posts`, {
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
            .then((response) => setPostList(response.data))
            .catch((error) => {
                throw new Error(error);
            })
    }, []);

    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <h1 className={styles["title"]}>My Blog</h1>
            <h2 className={styles["post-list-title"]}>Post List</h2>
            {creating
            ?   <div className={styles["post-form"]}>
                    <PostForm
                        onCloseHandler={() => {
                            setSubmissionErrors([]);
                            setCreating(false);
                            setEditing(false);
                        }}
                        onSubmitHandler={(e) => {
                            createPost(e);
                        }}
                        submissionErrors={submissionErrors}
                    />
                </div>
            :   <button
                    className={styles["create-new-post-button"]}
                    onClick={(e) => {
                        setCreating(true);
                        e.currentTarget.blur();
                        e.preventDefault();
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.blur();
                    }}
                >Create New Post</button>}
            <ul className={styles["post-list"]}>
            {postList ? postList.map((post) => {
                return post.visible ? (
                    <li className={styles["post"]} key={post._id}>
                    <Post
                        _id={post._id ? post._id : null}
                        title={post.title ? post.title : "Error"}
                        text={post.text ? post.text : "Error"}
                        datePosted={post.date_posted ? post.date_posted : null}
                        dateLastUpdated={post.date_last_updated ? post.date_last_updated : null}
                        commentCount={post.comments ? post.comments.length : 0}
                        visible={post.visible}
                    />
                    </li>
                ) : null;
            }) : null}
            </ul>
        </div>
        </div>
    );
}

export default PostList;