import { useState, useEffect } from "react";
import styles from "./index.module.css";

import Post from "./components/Post";

const PostList = () => {
    const [postList, setPostList] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/posts", {
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
            .catch((error) => console.log(error))
    }, []);

    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <h1 className={styles["title"]}>My Blog</h1>
            <h2 className={styles["post-list-title"]}>Post List</h2>
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