import mongoose from "mongoose"

export const dbConn = async (uri) =>{
    try {
        await mongoose.connect(uri)        
        console.log("database connected successfully!")
    } catch (error) {
        throw new Error(`Something went wrong with the database connection ${error.message}`)
    }
}