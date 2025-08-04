import mongoose from "mongoose";
import validator from "validator";
import { nanoid } from "nanoid";
import crypto from "crypto";

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email or password! " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    salt: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error("Invalid gender value")
            }
        }
    },
    pohtoUrl: {
        type: String
    },
    skills: {
        type: [String]
    }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model('user', userSchema)


const createPasswordHash = async (password, salt) => {
    const hashPassword = crypto.createHash('md5').update(Buffer.from(password)).digest('hex') + salt
    return hashPassword
}

const throwError = (errmsg) => {
    throw new Error(errmsg)
}


const registerUser = async (user) => {
    const { firstName, lastName, emailId, password } = user

    const isUserExist = await userModel.findOne({ emailId })
    if (isUserExist) {
        throwError("user already exist")
    }

    const salt = nanoid(10)

    // console.log(password,salt)

    const hashPassword = await createPasswordHash(password, salt)

    const newUser = await userModel.create({ firstName, lastName, emailId, password: hashPassword, salt })
    // newUser.save()

    if (!newUser) {
        throwError("not able to register?, please try again");
    }

    return newUser
}

const authenticateUser = async ({ emailId, password }) => {

    const isUserExist = await userModel.findOne({ emailId })
    if (!isUserExist) {
        throwError('User does not exist , please sign up first!')
    }

    const logInPassword = await createPasswordHash(password, isUserExist.salt)
    if (!logInPassword === isUserExist.password) {
        throwError("Invalid emailId or password")
    }

    return isUserExist
}

const getUser = async (_id) => {
    const user = await userModel.findOne({ _id: new mongoose.Types.ObjectId(_id) })
    if (!user) {
        throwError("did not find the user!")
    }
    return user
}

const profileUpdate = async (dataToBeEdited, user) => {

    const updatedUser = Object.keys(dataToBeEdited).map((key) => user[key] = dataToBeEdited[key])

    const userUpdated = await userModel.findOneAndUpdate({ _id: user._id }, updatedUser)

    return userUpdated
}




export const userDomain = {
    registerUser,
    authenticateUser,
    getUser,
    profileUpdate
}