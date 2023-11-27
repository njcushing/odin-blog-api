import PropTypes from "prop-types";
import styles from "./index.module.css";

import MaterialSymbolsButton from "@/components/MaterialSymbolsButton";

const CommentForm = ({
    onCloseHandler,
    onSubmitHandler,
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
                        All fields marked with a * are <strong>required</strong>.
                </h4>
            </div>
            <form
                className={styles["form"]}
                method="POST"
                action="/"
            >
                <div className={styles["names"]}>
                    <label className={styles["first-name"]}>First Name *
                        <input type="text" id="first-name" name="first_name"></input>
                    </label>
                    <label className={styles["last-name"]}>Last Name *
                        <input type="text" id="last-name" name="last_name"></input>
                    </label>
                </div>
                <label className={styles["comment"]}>Your Comment *
                    <textarea id="text" name="text"></textarea>
                </label>
                <button
                    className={styles["submit-button"]}
                    type="submit"
                    onClick={onSubmitHandler}
                >Post Comment</button>
            </form>
        </div>
        </div>
    );
}

CommentForm.propTypes = {
    onCloseHandler: PropTypes.func,
    onSubmitHandler: PropTypes.func,
}

CommentForm.defaultProps = {
    onCloseHandler: () => {},
    onSubmitHandler: () => {},
}

export default CommentForm;