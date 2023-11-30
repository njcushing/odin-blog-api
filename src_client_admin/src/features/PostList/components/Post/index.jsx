import { useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";

import { DateTime } from "luxon";
import mongoose from "mongoose";

import MaterialSymbolsAnchor from "@/components/MaterialSymbolsAnchor";
import MaterialSymbolsButton from "@/components/MaterialSymbolsButton";
import PostForm from "../PostForm";

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

    const deletePost = useCallback(async (e) => {
        e.currentTarget.blur();
        e.preventDefault(); // Prevent form submission; handle manually

        // DELETE post
        await fetch(`${process.env.SERVER_DOMAIN}/posts/${_id}`, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "authorization": localStorage.getItem("authToken"),
            }
        })
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error(`Request error: status ${response.status}`);
                } else {
                    return response.json();
                }
            })
            .then((response) => {
                // Successful response - refresh page
                location.reload(true);
            })
            .catch((error) => {
                throw new Error(error);
            })
    }, []);

    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <h3 className={styles["title"]}>{title}</h3>
            <p className={styles["text"]}>{text}</p>
            <div className={styles["dates"]}>
                <h5 className={styles["date-string"]}>Date posted: {datePostedFormatted}</h5>
                <h5 className={styles["date-string"]}>Date last updated: {dateLastUpdatedFormatted}</h5>
            </div>
            <div className={styles["comments-information-container"]}>
                <h5 className={styles["comment-count"]}>Comments: {commentCount}</h5>
                <MaterialSymbolsAnchor
                    href={_idValidated ? `${window.location.href}/${_idValidated}` : null}
                    aria-label="View post"
                    text="article"
                    sizeRem={1.8}
                />
            </div>
            <div className={styles["edit-and-delete-buttons-container"]}>
                <div className={styles["delete-button"]}>
                    Delete
                    <MaterialSymbolsButton
                        aria-label="Delete post"
                        text="delete"
                        onClickHandler={(e) => { deletePost(e); }}
                        sizeRem={1.8}
                    />
                </div>
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