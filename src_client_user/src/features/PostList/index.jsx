import { useState, useEffect } from "react";

import Post from "@/components/Post";

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
        <>
            <h1>Posts</h1>
            {postList ? postList.map((post) => {
                return post.visible ? (
                    <Post
                        key={post._id}
                        title={post.title ? post.title : "Error"}
                        text={post.text ? post.text : "Error"}
                        datePosted={post.date_posted ? post.date_posted : null}
                        dateLastUpdated={post.date_last_updated ? post.date_last_updated : null}
                        commentCount={post.comments ? post.comments.length : 0}
                    />
                ) : null;
            }) : null}
        </>
    );
}

export default PostList;