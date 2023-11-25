import PropTypes from "prop-types";
import styles from "./index.module.css";

const Post = ({
    title,
    text,
    postedDate,
    dateLastUpdated,
    commentCount,
}) => {
    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <h3 className={styles["title"]}>{title}</h3>
            <p className={styles["text"]}>{text}</p>
        </div>
        </div>
    );
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    postedDate: PropTypes.string,
    dateLastUpdated: PropTypes.string,
    commentCount: PropTypes.number,
}

Post.defaultProps = {
    postedDate: null,
    dateLastUpdated: null,
    commentCount: 0,
}

export default Post;