//there is an Error class provided by node.js using which we can easily clasify and check for errors in the API


class APIError extends Error{
    constructor(statusCode,
        message="went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors


        if(stack){
            this.stack=stack
        }else{(this,this.constructor)
        }
    }
}

export {APIError}