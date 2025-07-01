import { userDomain } from "../domain/auth/index.js"
import { handleRoute } from "../lib/handleRoute.js"
import { userSession } from "../middlewares/userSession.js"
import { datavalidation } from "../utils/validateData.js"

export const userprofile = (basepath, app) => {
    app.get(`${basepath}/view`, userSession, async (req, res) => {
        const user = req.user
        if (!user) {
            throw new Error("User does not exist!")
        }
        res.send(user)
    })

    app.patch(`${basepath}/updates`, userSession, async (req, res) => {

        if (!datavalidation.validateDataToBeUpdated(req)) {
            throw new Error("Please update the allowed fields!")
        }

        const user = await userDomain.profileUpdate(req.body, req.user)
            res.json({ message: "user data updated successfully" })
    })
}