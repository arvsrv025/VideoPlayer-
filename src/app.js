import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app=express()

// Middleware ...all are created using app.use

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))
//so as to easily accept .json file that is coming from backend
app.use(express.json({limit:"16kb"}))
//done beacuse many urls are encoded in different format,therefore url encoding will be an issue
app.use(express.urlencoded({extended:true,limit:"16kb"}));
//to store the pdf and images that come in a folder named public
app.use(express.static("public"))
//to accept the cookies from the website about the user and send the cookie set 
app.use(cookieParser())


//ROUTES
//import router
import userRouter from './Routes/user.routes.js'

//routes declaration

app.use('/api/v1/users',userRouter)


export {app}