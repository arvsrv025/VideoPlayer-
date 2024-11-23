import {asyncHandler} from '../Utils/asyncHandler.js';
import {APIError} from '../Utils/APIError.js';
import {User} from '../Models/user.model.js';
import {uploadOnCloudinary} from '../Utils/cloudinary.js';
import {APIResponse} from '../Utils/APIResponse.js';


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

    const {fullName,email,username,password}=req.body
    console.log(email);


    if([fullName,email,username,password].some((field)=>
        field?.trim==="")){
        throw new APIError(400,"All Fields is required")
    }

    const exisetdUser=User.findOne({
        $or:[{username},{email}]
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
        username: username.toLowerCase(),

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

export {registerUser}