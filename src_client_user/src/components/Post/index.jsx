import PropTypes from "prop-types";
import styles from "./index.module.css";

import { DateTime } from "luxon";

var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

const Post = ({
    title,
    text,
    datePosted,
    dateLastUpdated,
    commentCount,
}) => {
    let datePostedFormatted;
    if (datePosted && isDate(datePosted)) {
        datePostedFormatted = DateTime.fromJSDate(new Date(datePosted)).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS
        );
    } else {
        datePostedFormatted = "Unknown"
    }
    let dateLastUpdatedFormatted;
    if (dateLastUpdated && isDate(dateLastUpdated)) {
        dateLastUpdatedFormatted = DateTime.fromJSDate(new Date(dateLastUpdated)).toLocaleString(
            DateTime.DATETIME_SHORT_WITH_SECONDS
        );
    } else {
        dateLastUpdatedFormatted = "Unknown"
    }

    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <h3 className={styles["title"]}>{title}</h3>
            <p className={styles["text"]}>{text}</p>
            <div className={styles["dates"]}>
                <h5 className={styles["date-string"]}>Date posted: {datePostedFormatted}</h5>
                <h5 className={styles["date-string"]}>Date last updated: {dateLastUpdatedFormatted}</h5>
            </div>
        </div>
        </div>
    );
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    datePosted: PropTypes.string,
    dateLastUpdated: PropTypes.string,
    commentCount: PropTypes.number,
}

Post.defaultProps = {
    datePosted: null,
    dateLastUpdated: null,
    commentCount: 0,
}

export default Post;