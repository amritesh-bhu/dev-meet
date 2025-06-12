import { handleRoute } from "../lib/handleRoute.js"
import { userSession } from "../middlewares/userSession.js"
import { datavalidation } from "../utils/validateData.js"

export const userprofile = (basepath, app) => {
    app.get(`${basepath}/view`, handleRoute(userSession), handleRoute(async (req, res) => {
        const user = req.user
        if (!user) {
            throw new Error("User does not exist!")
        }
        res.send(user)
    }))

    app.get(`${basepath}/updates`, handleRoute(userSession), handleRoute(async (req, res) => {

        if(datavalidation.validateDataToBeUpdated(req)){
            throw new Error("")
        }

    }))
}