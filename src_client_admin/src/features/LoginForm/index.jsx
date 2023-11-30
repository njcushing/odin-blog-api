import { useState } from "react";
import styles from "./index.module.css";

const LoginForm = () => {
    const [submissionErrors, setSubmissionErrors] = useState([]);

    const login = (e) => {}

    return (
        <div className={styles["wrapper"]}>
        <div className={styles["container"]}>
            <form
                className={styles["form"]}
                method="POST"
                action=""
            >
                <h4
                    className={styles["requirement-message"]}
                >
                        All fields marked with a <strong>*</strong> are <strong>required</strong>.
                </h4>
                <div className={styles["form-fields"]}>
                    <label className={styles["username"]}>First Name *
                        <input type="text" id="username" name="username" required></input>
                    </label>
                    <label className={styles["password"]}>Last Name *
                        <input type="password" id="password" name="password" required></input>
                    </label>
                </div>
                <button
                    className={styles["submit-button"]}
                    type="submit"
                    onClick={(e) => {
                        login(e);
                        e.currentTarget.blur();
                        e.preventDefault();
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.blur();
                    }}
                >Log in</button>
                {submissionErrors.length > 0
                ?   <div className={styles["submission-errors"]}>
                        <h4 className={styles["error-title"]}>Error(s):</h4>
                        <ul className={styles["error-list"]}>
                            {submissionErrors.map((error) => {
                                return <li className={styles["error-item"]}>{error}</li>
                            })}
                        </ul>
                    </div>
                :   null}
            </form>
            <button
                className={styles["return-button"]}
                onClick={(e) => {
                    e.currentTarget.blur();
                    e.preventDefault();
                    window.location.href = "/posts";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.blur();
                }}
            >Return to Post List</button>
        </div>
        </div>
    );
}

export default LoginForm;