import validator from "validator"

const signUpdataValidator = (req) => {
    const { firstName, lastName, emailId, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("Please enter the valid user details")
    } else if (!validator.isEmail(emailId) || !validator.isStrongPassword(password)) {
        throw new Error("invalid email id or password!")
    }
}

const validateDataToBeUpdated = (req) => {
    const allowedUpdates = ["firstName", "lastName", "age", "photoUrl", "skills"]

    const isAllowedUpdates = Object.keys(req.body).every((key) => allowedUpdates.includes(key))

    return isAllowedUpdates
}

export const datavalidation = {
    signUpdataValidator,
    validateDataToBeUpdated
}