import { datavalidation } from "../utils/validateData.js"
import { userDomain } from "../domain/auth/index.js"
import jwt from 'jsonwebtoken'
import { handleRoute } from "../lib/handleRoute.js"

export const userSignUp = (basepath, app) => {
    // const app = new Router()

    app.post(`${basepath}/signup`, handleRoute(async (req, res) => {
        try {

            datavalidation.signUpdataValidator(req)

            const { firstName, lastName, emailId, password } = req.body

            const user = await userDomain.registerUser({ firstName, lastName, emailId, password })
            res.json({ message: 'User created successfully', data: user })

        } catch (err) {
            res.status(500).send(err.message)
        }
    }))

    app.post(`${basepath}/login`, handleRoute(async (req, res) => {
        try {
            const { emailId, password } = req.body

            const user = await userDomain.authenticateUser({ emailId, password })

            const token = await jwt.sign({ _id: user._id }, "login@user", { expiresIn: "7d" })

            res.cookie('token', token, { expires: new Date(Date.now() + 7 * 3600 * 3600), httpOnly: true })

            res.json({ message: 'Logged In succesfully' })

        } catch (err) {
            res.status(500).send(err.message)
        }
    }))
}           