import { userDomain } from "../domain/auth/index.js"
import { connDomain } from "../domain/connections/index.js"
import { handleRoute } from "../lib/handleRoute.js"
import { userSession } from "../middlewares/userSession.js"
import express from "express";


export const friendRequestRouter = express.Router()


friendRequestRouter.get('/', userSession, async (req, res) => {
    try {
        const userId = req.user._id

        console.log(userId)

        const connectedDevs = await connDomain.getConnectedDevs(userId)
        if (!connectedDevs.length) {
            res.status(200).json({ message: "You are not connected to anyone!!!" })
        }

        res.status(200).json({ message: "Please find your connected developers!!", data: connectedDevs })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


friendRequestRouter.post('/request/send/:status/:userId', handleRoute(userSession), handleRoute(async (req, res) => {

    try {
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
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}))


friendRequestRouter.patch('/request/review/:status/:userId', userSession, async (req, res) => {
    try {
        const { status, userId } = req.params

        const fromUserId = req.user._id

        const allowedStatus = ['accept', 'reject']
        const isAllowedStatus = allowedStatus.includes(status)

        if (!isAllowedStatus) {
            throw new Error('Invalid status request!!')
        }

        const isUserExist = await userDomain.getUser(userId)
        if (!isUserExist) {
            throw new Error('User does not exist!!')
        }

        const friendStatus = await connDomain.updateRequestStatus({ fromUserId, userId, status })
        res.json({ message: "Status updated successfully!!!" })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})


friendRequestRouter.get('/request/received', userSession, async (req, res) => {
    try {
        const toUserId = req.user._id

        const receivedRequest = await connDomain.getFriendRequests({ toUserId })
        if (!receivedRequest.length) {
            res.status(200).json({ message: "No new requests received!!" })
        }

        res.status(200).json({ message: "friend request fetched successfully!!", data: receivedRequest })
    } catch (error) {
        res.status(400).json({ message: err.message })
    }
})
