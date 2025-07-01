import mongoose from "mongoose";

const connSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user"
    },
    toUserId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "user"
    },
    status: {
        type: String,
        required: true
    }
})


const connModel = mongoose.model("connModel", connSchema)

const createConnection = async ({ status, fromUserId, userId }) => {

    const isAlreadyFriend = await connModel.findOne({
        $or: [
            { fromUserId, toUserId: new mongoose.Types.ObjectId(userId) },
            { fromUserId: new mongoose.Types.ObjectId(userId), toUserId: fromUserId }
        ]
    })

    console.log(isAlreadyFriend)

    if (isAlreadyFriend) {
        throw new Error("You are already friend with him!!")
    }

    const newConn = await connModel.create({ fromUserId, toUserId: new mongoose.Types.ObjectId(userId), status })

    if (!newConn) {
        throw new Error("connection couldn't make , something went wrong!!")
    }

    return newConn
}

const updateRequestStatus = async ({ fromUserId, userId, status }) => {
    const userWithUpdatedStatus = await connModel.findOneAndUpdate(
        { fromUserId, toUserId: new mongoose.Types.ObjectId(userId), status: "interested" },
        {
            $set: { status: status }
        })

    if (!userWithUpdatedStatus) {
        throw new Error("Invalid user with this status!!")
    }

    return userWithUpdatedStatus

}


export const connDomain = {
    createConnection,
    updateRequestStatus
}