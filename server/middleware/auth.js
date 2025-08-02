import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const protectRoute = async(req,res,next) =>{
    try {
          //This token in headers will be send by the Frontend.
        const token =  req.headers.token ; 
        console.log(token , "FE ka token") ;
         //Decoding the token to get the userid , token waas made by combining the userId and the JWT_SECRET.
        const decodeToken = jwt.verify(token , process.env.JWT_SECRET) ;
        console.log(decodeToken , "DecToken hu");

        const user = await User.findById(decodeToken.userId).select("-password");
      

        if(!user) return res.json({success:false , message:"User not found!"});
        console.log(user._id);
        //Attach this found user for the next middlewares to have access to them.
         
        req.newUser = user;
        
        next();
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false , message:error.message})
    }
    
}