import mongoose from "mongoose";

export  const connectDB = async() =>{
    
    try {
        //Event listner listening to connected event.
        mongoose.connection.on('connected' , ()=>{console.log("Database Connected!")})
        //Connection process.
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
        
    } catch (error) {
        console.log(error)
    }
}