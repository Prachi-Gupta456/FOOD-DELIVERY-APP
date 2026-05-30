"use client"

import { GoogleAuthProvider } from "firebase/auth"
import { signInWithPopup } from "firebase/auth"
import auth from "./config"

const GoogleAuth = async () => {
    try {

        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user
    
        return {
            success:true,
            user:{
                fullName:user.displayName,
                email:user.email
            }
        }

    } catch (error) {
        console.log(error)
          return {
            success:false,
            msg:"Service unavailable.Try again later."
        }

    }


}

export default GoogleAuth;