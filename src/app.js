import cookieParser from "cookie-parser";
import express from "express";
import { dbConn } from "./config/dbCon.js";
import { userSignUp } from "./routes/auth.js";
import { userprofile } from "./routes/profile.js";

dbConn('mongodb://127.0.0.1:27017/dev-meet')

const app = express()
const port = 3000

app.use(express.json())
app.use(cookieParser())


userSignUp('/user', app)
userprofile('/profile', app)

app.use((err, req, res, next) => {
    res.status(400).send('something went wrong !' + err.message)
})


app.listen(port, () => {
    console.log(`app is listening at port ${port}`)
})
