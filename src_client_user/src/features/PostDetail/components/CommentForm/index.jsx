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
            <div className={styles["close-form-button"]}>
                <MaterialSymbolsButton
                    aria-label="Close form"
                    text="close"
                    onClickHandler={onCloseHandler}
                    sizeRem={1.8}
                />
            </div>
            <form
                className={styles["form"]}
                method="POST"
                action="/"
            >
                <label className={styles["form-label"]}>First Name *
                    <input type="text" id="first-name" name="first_name"></input>
                </label>
                <label className={styles["form-label"]}>Last Name *
                    <input type="text" id="last-name" name="last_name"></input>
                </label>
                <label className={styles["form-label"]}>Your Comment *
                    <textarea id="text" name="text"></textarea>
                </label>
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