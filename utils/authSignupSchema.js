import * as Yup from "yup";

const signupSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),

    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long"),

    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export default signupSchema;
