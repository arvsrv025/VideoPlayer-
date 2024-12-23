import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})


const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath)return null;
        //upload the file on cloudinary using if esle to reduce error interaction

        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded
        console.log("File has been uploaded on cloudinary",response.url);
        return response;
    }
    catch(error){
        //it will remoce the locally saved temporary file as the upload operation got failed
        fs.unlinkSync(localFilePath);
        return null;
    }


}

export {uploadOnCloudinary}