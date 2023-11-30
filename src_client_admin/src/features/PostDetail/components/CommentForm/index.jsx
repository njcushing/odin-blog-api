import PropTypes from "prop-types";
import styles from "./index.module.css";

import MaterialSymbolsButton from "@/components/MaterialSymbolsButton";

const CommentForm = ({
    onCloseHandler,
    onSubmitHandler,
    submissionErrors,
}) => {
    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <div className={styles["top-row"]}>
                <div className={styles["close-form-button"]}>
                    <MaterialSymbolsButton
                        aria-label="Close form"
                        text="close"
                        onClickHandler={onCloseHandler}
                        sizeRem={1.8}
                    />
                </div>
                <h4
                    className={styles["requirement-message"]}
                >
                        All fields marked with a <strong>*</strong> are <strong>required</strong>.
                </h4>
            </div>
            <form
                className={styles["form"]}
                method="POST"
                action=""
            >
                <div className={styles["names"]}>
                    <label className={styles["first-name"]}>First Name *
                        <input type="text" id="first-name" name="first_name" required></input>
                    </label>
                    <label className={styles["last-name"]}>Last Name *
                        <input type="text" id="last-name" name="last_name" required></input>
                    </label>
                </div>
                <label className={styles["comment"]}>Your Comment *
                    <textarea id="text" name="text" required></textarea>
                </label>
                <button
                    className={styles["submit-button"]}
                    type="submit"
                    onClick={(e) => {
                        onSubmitHandler(e);
                        e.currentTarget.blur();
                        e.preventDefault();
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.blur();
                    }}
                >Post Comment</button>
                {submissionErrors.length > 0
                ?   <div className={styles["submission-errors"]}>
                        <h4 className={styles["error-title"]}>Error(s):</h4>
                        <ul className={styles["error-list"]}>
                            {submissionErrors.map((error, index) => {
                                return <li
                                    key={index + 1}
                                    className={styles["error-item"]}
                                >{error}</li>
                            })}
                        </ul>
                    </div>
                :   null}
            </form>
        </div>
        </div>
    );
}

CommentForm.propTypes = {
    onCloseHandler: PropTypes.func,
    onSubmitHandler: PropTypes.func,
    submissionErrors: PropTypes.arrayOf(PropTypes.string),
}

CommentForm.defaultProps = {
    onCloseHandler: () => {},
    onSubmitHandler: () => {},
    submissionErrors: [],
}

export default CommentForm;