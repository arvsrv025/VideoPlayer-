import dotenv from "dotenv"
import connectDB from "./Database/indexDB.js"

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is running at port :${porcess.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGODB failed to connect  ",err);
})