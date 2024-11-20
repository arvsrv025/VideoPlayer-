import dotenv from "dotenv"
import connectDB from "./Database/indexDB.js"

dotenv.config({
    path:'./env'
})

connectDB();