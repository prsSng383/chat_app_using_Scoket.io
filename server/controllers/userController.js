import User from "../models/user.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async(req , res) =>{
    const {fullName , email , password, bio } = await req.body;

    try {
        //1. Check every data is received
        //2. Check if the same user exists in the Database.
        //3. Create hashed password and update the current DB , with new user details.
        //4. Generate the jwt token and send to the Browser.
        console.log(req.body);
        if(!fullName || !email || !password || !bio) return res.json({success: false , message:"Missing Details"})
        
       const dbUser = await User.findOne({email});
       if(dbUser) return res.json({success:false , message:"User already exists"});
      
       const hashPass = await bcrypt.hash(password , 10);
      
       const newUser = await User.create({
        fullName , email , password:hashPass , bio
       }) 
       
       const token =  generateToken(newUser._id)
     
       return res.json({success:true , token , userData : newUser , message:"Account Created Succesfully!"})

    } catch (error) {
        console.log(error.message);

        return res.json({success:false , message:error.message});
    }

}


export const login = async(req,res) =>{
    
    const {email , password} = req.body;
    console.log(req.body);
    
    try {
          
       if(!email || !password) return res.json({success:false , message:"Missing field"}); 


       const dbUser = await User.findOne({email});
     

       if(!dbUser) return res.json({success:false , message:"User does not exists! SignUp first."});
        
     
       const decryptPass = await bcrypt.compare(password , dbUser.password);

       if(!decryptPass) return res.json({success:false , message:"Invalid Credentials!"})
      
        const token =  generateToken(dbUser._id);
        
       console.log(token)
       return res.json({success:true ,userData:dbUser, token , message:"User Logged-In Successfully"})
       


    } catch (error) {
        console.log(error.message);
        return res.json({success:false , message:error.message});
        
    }
}
//Check user auth
export const  checkAuth = async(req ,res) =>{

    res.json({success:true , user:req.newUser});
    
}

//Update user profile details
export const updateProfile = async(req,res)=>{
    try {
        const{profilePic , bio , fullName} = req.body;
        console.log(req.body);
        
        const userId = req.newUser.id ;
        console.log(userId);
      
        let updatedUser;

        if(!profilePic){
          updatedUser = await User.findByIdAndUpdate(userId , {bio , fullName},{new:true});
          console.log(updatedUser);
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId , {profilePic:upload.secure_url , bio , fullName}, {new:true})
        }

        res.json({success:true , user:updatedUser})
    } catch (error) {
        console.log(error.message)
        res.json({success:false , message:error.message});
    }
}
