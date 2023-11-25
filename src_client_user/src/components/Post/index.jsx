import PropTypes from "prop-types";

const Post = ({
    title,
    text,
    postedDate,
    dateLastUpdated,
    commentCount,
}) => {
    return (
        <>
        <p>{title}</p>
        <p>{text}</p>
        </>
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