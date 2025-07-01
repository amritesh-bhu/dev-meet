import cookieParser from "cookie-parser";
import express from "express";
import { dbConn } from "./config/dbCon.js";
import { authRouter } from "./routes/user-auth.js";
import { profileRouter } from "./routes/user-profile.js";
import { friendRequestRouter } from "./routes/friend-request-route.js";

dbConn('mongodb://127.0.0.1:27017/dev-meet')

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())


app.use('/user', authRouter)
app.use('/profile', profileRouter)
app.use('/connection', friendRequestRouter)

app.use((err, req, res, next) => {
    res.status(404).send({ message: err.message })
})


app.listen(port, () => {
    console.log(`app is listening at port ${port}`)
})
