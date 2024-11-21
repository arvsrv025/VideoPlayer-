import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 

//to establish the connection with the database
const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMongoDB connected...DB Host :${connectionInstance.connection.host}`);

    }
    catch(error){
            console.log("MONGODB connection error",error);
            process.exit(1);

    }
}

export default connectDB;