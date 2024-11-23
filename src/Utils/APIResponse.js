//to check the APIResponse that we are getting and access it
//however the  node.js Error class doesn't have any handling methods or defintions for req,res objects
//so we create a different manual class to handle req,res under the name APIResponse class

class APIResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400

    }
}

export {APIResponse}