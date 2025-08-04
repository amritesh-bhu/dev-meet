import { userDomain } from "../domain/auth/index.js"
import { userSession } from "../middlewares/userSession.js"
import { datavalidation } from "../utils/validateData.js"
import express from "express"


export const profileRouter = express.Router()

profileRouter.get('/view', userSession, async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            throw new Error("User does not exist!")
        }
        res.send(user)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }

})

profileRouter.patch('/updates', userSession, async (req, res) => {

    try {
        if (!datavalidation.validateDataToBeUpdated(req)) {
            throw new Error("Please update the allowed fields!")
        }

        const user = await userDomain.profileUpdate(req.body, req.user)
        res.json({ message: "user data updated successfully" })

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})
