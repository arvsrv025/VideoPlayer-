//this middleware will check if the user is present or not

import { APIError } from "../Utils/APIError.js"
import { asyncHandler } from "../Utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js"


//in cases where there is no response obkect we just add a undescore '_'
export const verifyJWT=asyncHandler(async(req,_,next)=>{
    //since we added the middleware named cookies usinf=g app.use earlier we can make sure 
    //that the req object here will have the cookies in it bec it is a middleware
    try
    {const token=await req.cookies?.accesToken||req.header("Authorization")?.replace("Bearer ","")
    if(!token){
        throw new APIError(401,"Unautorised user")
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
        throw new APIError(401,"Invalid Access Token")
    }

    req.user=user;
    next()
    }catch(error){
        throw new APIError(401,error?.message||"Invalid access toekn")
    }

})