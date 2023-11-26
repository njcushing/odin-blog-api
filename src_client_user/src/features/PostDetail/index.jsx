import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";

import CommentList from "./components/CommentList";

const PostDetail = () => {
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
            <div className={styles["post-information"]}>
                <h1 className={styles["title"]}>{post ? post.title ? post.title : "" : ""}</h1>
                <p className={styles["text"]}>{post ? post.text ? post.text : "" : ""}</p>
                {post ? post.comments
                ? <CommentList
                    postId={postId}
                    commentIds={post.comments}
                    maximumDepth={4}
                    />
                : null : null}
            </div>
        </div>
        </div>
    );
}

export default PostDetail;