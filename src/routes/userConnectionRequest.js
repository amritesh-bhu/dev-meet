import mongoose from "mongoose"
import { userDomain } from "../domain/auth/index.js"
import { connDomain } from "../domain/connections/index.js"
import { handleRoute } from "../lib/handleRoute.js"
import { userSession } from "../middlewares/userSession.js"

export const userConnectionRequest = (basepath, app) => {
    app.post(`${basepath}/request/send/:status/:userId`, handleRoute(userSession), handleRoute(async (req, res) => {

        const { status, userId } = req.params

        const isUserExist = await userDomain.getUser(userId)
        if (!isUserExist) {
            throw new Error('User does not exist any more..!!')
        }

        const fromUserId = req.user._id
        console.log("fromUserId : ", fromUserId)
        const allowedStatus = ['interested', 'ignored']

        const isAllowedStatus = allowedStatus.includes(status)
        if (!isAllowedStatus) {
            throw new Error('Invalid status request')
        }

        const conReq = await connDomain.createConnection({ status, fromUserId, userId })
        res.json({ message: "Connection request sent successfully!!", data: conReq })
    }))
}