import { useState, useCallback } from "react";
import styles from "./index.module.css";

const LoginForm = () => {
    const [submissionErrors, setSubmissionErrors] = useState([]);

    const attemptLogin = useCallback(async (e) => {
        e.currentTarget.blur();
        e.preventDefault(); // Prevent form submission; handle manually
    
        const formData = new FormData(e.target.form);
        const formFields = Object.fromEntries(formData);
        const formDataJSON = JSON.stringify(formFields);

        // Client-side validation
        const errors = [];
        if (formFields.password.length < 1) errors.push("Please fill in the First Name field.");
        if (formFields.username.length < 1) errors.push("Please fill in the Last Name field.");
        if (errors.length > 0) {
            setSubmissionErrors(errors);
            return;
        }

        // POST user credentials
        await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/login`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: formDataJSON,
        })
            .then(async (response) => {
                const json = await response.json();
                if (response.status >= 400) {
                    setSubmissionErrors([json.message]);
                    throw new Error(`Request error: status ${response.status}`);
                } else {
                    return json;
                }
            })
            .then((response) => {
                const token = response.data.token;
                localStorage.setItem("authToken", 'Bearer ' + token);
                // Successful response - refresh page
                window.location.href = "/posts";
            })
            .catch((error) => {
                throw new Error(error);
            })
    }, []);

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
                        attemptLogin(e);
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