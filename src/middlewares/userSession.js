import { userDomain } from "../domain/auth/index.js"
import jwt from "jsonwebtoken"

export const userSession = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Hey please login first to get the access!")
        }

        const userDecodedMsg = jwt.verify(token, "login@user")
        if (!userDecodedMsg) {
            throw new Error("failed to decode JWT")
        }
        const { _id } = userDecodedMsg

        const userDetails = await userDomain.getUser(_id)
        req.user = userDetails

        next()
    } catch (err) {
        next(err)
    }
}