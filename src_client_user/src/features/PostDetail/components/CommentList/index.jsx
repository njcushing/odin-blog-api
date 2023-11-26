import PropTypes from "prop-types";
import styles from "./index.module.css";

import Comment from "../Comment";

const CommentList = ({
    postId,
    commentIds,
    maximumDepth,
}) => {
    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <ul className={styles["comment-list"]}>
                <h3 className={styles["title"]}>Comments:</h3>
                {commentIds.map((comment) => {
                    return (
                        <Comment
                            postId={postId}
                            commentId={comment}
                            depth={0}
                            maximumDepth={maximumDepth}
                        />
                    );
                })}
            </ul>
        </div>
        </div>
    );
}

CommentList.propTypes = {
    postId: PropTypes.string.isRequired,
    commentIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    maximumDepth: function(props, propName, componentName) {
        if (!Number.isInteger(props[propName])) {
            return new Error(`Invalid prop '${propName}' supplied to
            component '${componentName}'. Must be an integer.`);
        }
    }
}

export default CommentList;