import PropTypes from "prop-types";
import styles from "./index.module.css";

import { DateTime } from "luxon";

import mongoose from "mongoose";
import MaterialSymbolsAnchor from "@/components/MaterialSymbolsAnchor";

var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

const Post = ({
    _id,
    title,
    text,
    datePosted,
    dateLastUpdated,
    commentCount,
}) => {
    let _idValidated = _id;
    if (!mongoose.Types.ObjectId.isValid(_id)) _idValidated = null;

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
            <div className={styles["bottom-row"]}>
                <h5 className={styles["comment-count"]}>Comments: {commentCount}</h5>
                <MaterialSymbolsAnchor
                    href={_idValidated ? `${window.location.href}/${_idValidated}` : null}
                    aria-label="View post"
                    text="article"
                    sizeRem={1.8}
                />
            </div>
        </div>
        </div>
    );
}

Post.propTypes = {
    _id: PropTypes.string.isRequired,
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