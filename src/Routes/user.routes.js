import { Router } from "express";
import {registerUser} from '../Controllers/user.controller.js'
import {upload} from "../MiddleWare/multer.middleware.js"
import {loginUser,logoutUser} from '../Controllers/user.controller.js'
import {verifyJWT} from "../MiddleWare/auth.middleware.js"

const router=Router();


router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)

export default router