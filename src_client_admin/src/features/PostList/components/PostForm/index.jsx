import PropTypes from "prop-types";
import styles from "./index.module.css";

import MaterialSymbolsButton from "@/components/MaterialSymbolsButton";

const PostForm = ({
    onCloseHandler,
    onSubmitHandler,
    submissionErrors,
    title,
    text,
    visible,
}) => {
    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <div className={styles["close-button-and-requirement-message"]}>
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
                <label className={styles["title"]}>Title *
                    <input type="text" id="title" name="title" defaultValue={title} required></input>
                </label>
                <label className={styles["text"]}>Text *
                    <textarea id="text" name="text" defaultValue={text} required></textarea>
                </label>
                <label className={styles["visible-checkbox"]}>Visible *
                    <input
                        type="checkbox"
                        id="visible"
                        name="visible"
                        defaultChecked={visible}
                        required
                    ></input>
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
                >Post</button>
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

PostForm.propTypes = {
    onCloseHandler: PropTypes.func,
    onSubmitHandler: PropTypes.func,
    submissionErrors: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    text: PropTypes.string,
    visible: PropTypes.bool,
}

PostForm.defaultProps = {
    onCloseHandler: () => {},
    onSubmitHandler: () => {},
    submissionErrors: [],
    title: "",
    text: "",
    visible: true,
}

export default PostForm;