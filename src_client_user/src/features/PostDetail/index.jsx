import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import Comment from "./components/Comment";

const Post = () => {
    const { postId } = useParams();

    return (
        <>
        <h1>{postId}</h1>
        </>
    );
}

export default Post;