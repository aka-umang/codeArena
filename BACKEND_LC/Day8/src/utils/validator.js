const validator = require("validator");

const validate = (data) => {

    const { firstName, emailId, password } = data;

    if (!firstName?.trim())
        throw new Error("Please enter your name.");

    if (!emailId?.trim())
        throw new Error("Email is required.");

    if (!validator.isEmail(emailId))
        throw new Error("Please enter a valid email address.");

    if (!password)
        throw new Error("Password is required.");

    if (
        !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        })
    ) {
        throw new Error(
            "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number."
        );
    }

};

module.exports = validate;