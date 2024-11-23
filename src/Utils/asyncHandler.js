//since the data that comes is IN THE DIFFERENT CONTINENT
//so we use async to streamline the incoming data and thus this file is created in UTILITY folder 
//because it is necessary to first make the data conitnuous using async await

const asyncHandler=(fn)=>async(req,res,next)=>{
        try{
            await fn(req,res,next)
        }catch(err){
            res.status(err.status || 500).json({
                success:false,
                message:err.message
            })
        }
}

export {asyncHandler}