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
            <MaterialSymbolsButton
                aria-label="Close form"
                text="close"
                onClickHandler={onCloseHandler}
                sizeRem={1.8}
            />
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