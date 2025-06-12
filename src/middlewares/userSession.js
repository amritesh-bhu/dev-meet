import { userDomain } from "../domain/auth/index.js"
import jwt from "jsonwebtoken"

export const userSession = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Hey please login first to get the access!")
        }

        const userDecodedMsg = await jwt.verify(token, "login@user")

        const { _id } = userDecodedMsg
        const userDetails = await userDomain.getLogedInUser(_id)

        req.user = userDetails

        next()
    } catch (err) {
        next(err)
    }
}