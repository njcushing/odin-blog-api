import PropTypes from "prop-types";
import styles from "./index.module.css";

import { DateTime } from "luxon";

import mongoose from "mongoose";
import MaterialSymbolsAnchor from "@/components/MaterialSymbolsAnchor";

var isDate = function(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

const Comment = ({
    _id,
    firstName,
    lastName,
    text,
    datePosted,
    dateLastUpdated,
    replyCount,
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
            <h3 className={styles["name"]}>{`${firstName} ${lastName}`}</h3>
            <p className={styles["text"]}>{text}</p>
            <div className={styles["dates"]}>
                <h5 className={styles["date-string"]}>Date posted: {datePostedFormatted}</h5>
                <h5 className={styles["date-string"]}>Date last updated: {dateLastUpdatedFormatted}</h5>
            </div>
            {replyCount > 0
                ? <h5 className={styles["reply-count"]}>
                    {`${replyCount} more ${replyCount === 1 ? "reply" : "replies"}`}
                </h5>
                : null
            }
        </div>
        </div>
    );
}

Comment.propTypes = {
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    datePosted: PropTypes.string,
    dateLastUpdated: PropTypes.string,
    replyCount: PropTypes.number,
}

Comment.defaultProps = {
    datePosted: null,
    dateLastUpdated: null,
    replyCount: 0,
}

export default Comment;