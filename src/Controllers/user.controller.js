import {asyncHandler} from '../Utils/asyncHandler.js';
import {APIError} from '../Utils/APIError.js';
import {User} from '../Models/user.model.js';
import {uploadOnCloudinary} from '../Utils/cloudinary.js';
import {APIResponse} from '../Utils/APIResponse.js';
import jwt from "jsonwebtoken" 


const generateAccessandRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateRefreshToken()
        const refreshToken=user.generateRefreshToken()

         //if we want to save the user deatils then we would have to pass all the details so
        //instead we pass validateBeforeSave so that only the field changed gets updated and required 
        //firlds dont pop up or change
        user.refreshToken=refreshToken
       
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new APIError(500,"Acees and Refresh Token generation error")
    }
}


const registerUser=asyncHandler(async(req,res)=>{
    //1.Get the details from the user
    //2.Check if the detail provided is valid or not
    //3.if the user exists or username exists
    //4.check for compulsory values if present or not
    //5.upload them on cloudinary 
    //6.create object of the data that has to enter the DB
    //7.remove passowrd and refresh token from response
    //8.check fro user creation
    //9.Post the data into the database 

    const {fullName,email,userName,password}=req.body
    console.log(email);


    if([fullName,email,userName,password].some((field)=>
        field?.trim==="")){
        throw new APIError(400,"All Fields is required")
    }

    const exisetdUser=await User.findOne({
        $or:[{userName},{email}]
    })
    if(exisetdUser){
        throw new APIError(409,"User already exists");
    }
    //avatr[0] is written because it gives many properties and from them we can .path
    //using which we can get the path of the avatar saved in cloudinary
    
    const avatarLocalPath=req.files?.avatar[0]?.path;

    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new APIError(400,"Avatar path not found")
    }

    //this can be a lengthy process because it can be used for 
    const avatar=await uploadOnCloudinary(avatarLocalPath) 
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new APIError(400,"Avatar file is required")
    }

    //creating User after checking all fields

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url|| "",
        email,
        password,
        userName: userName.toLowerCase()

    })
    //to check if the user is created succesfully
    //after select function we write a string that contains '-' that means to exclude these fiels after 
    //finding the user in the database 
    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new APIError(500,"Something went wrong so the user not created ");
    }

    //return a json object created using APIResponse class so as to better structure the data
    return res.status(201).json(new APIResponse(200,createdUser,"User Registerd successfully"))
})

const loginUser=asyncHandler(async(req,res)=>{
    //get the details from the user
    //check if the user exits or not
    //password check
    //access and refresh token 
    //send them as secure cookies
    const {email,userName,password}=req.body
    // console.log(email)
    if(!userName && !email){
        throw new APIError(408,"Username or email is required")
    }

    const user=await User.findOne({
        $or:[{userName},{email}]
    })
    if(!user){
        throw new APIError(404,"User doesn't exist")
    }

    const isvalid=await user.isPasswordCorrect(password)

    if(!isvalid){
        throw new APIError(404,"Password entered is wrong")
    }

    const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken ")
        //creating cookies
        //cookies can be modified from frontend easily so we add
        //httpOnly and secure so that it is only ediatble by the server 
        //it will be visible to the front end but cannot be edited now
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
              .cookie("accessToken",accessToken,options )
              .cookie("refreshToken",refreshToken,options)
              .json(new APIResponse(200,{user:loggedInUser,accessToken,refreshToken},"User found successfully"))

})


const logoutUser =  (async(req, res) => { 
    console.log(req.body)
    const {user_id}=await req.body._id

    await User.findByIdAndUpdate(
        user_id,
        {
            $set: {
                refreshToken: undefined 
            }
        },
        {
            new: true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIResponse(200, {}, "User logged Out"))
})


const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new APIError(401,"Unauthorised request")
    }

    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id)
    if(!user){
        throw new APIError(401,"unautorised request,invalid refresh token")
    }
    if(incomingRefreshToken!==user?.refreshToken){
        throw new APIError(401,"refresh token is expired or used")
    }
    const options={
        httpOnly:true,
        secure:true
     }
    const{accessToken,newRefreshToken}=await generateAccessandRefreshToken(user._id)

    return res.status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",newRefreshToken,options)
              .json(new APIResponse(200,{accessToken,refreshToken: newRefreshToken},"Access token refrehed succesfully"))
})

export {registerUser,loginUser,logoutUser,refreshAccessToken}