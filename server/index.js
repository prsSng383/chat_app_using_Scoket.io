import express from 'express'
import "dotenv/config.js"
import cors from "cors"
import http from "http"
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';



const app = express();

  const port = process.env.PORT || 5000;

//We need to create the http server because socket.io only supports http.
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: 'https://chat-app-frontend-prssng.vercel.app',
    credentials: true,
    methods: ["GET", "POST", "PUT"]
  }
});

//Store online Users
export const userSocketMap = {}; //{userId:socketId}
//Socket.io connection handler
io.on("connection", (socket)=>{ 
    const userId = socket.handshake.query.userId;
    console.log("User connected" , userId);

    if(userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients.
    io.emit("getOnlineUsers" , Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User Disconnected" , userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers" , Object.keys(userSocketMap));
    })
})

//Middleware
//All the requests will first parse through the json format.
app.use(express.json({limit:"4mb"}));

//It will allow all the URLs to connect with our backend.
app.use(cors({
  origin: 'https://chat-app-frontend-prssng.vercel.app',
  credentials: true
}));

//Calling connectDDB function here.
await connectDB();

//Routes setup
app.use('/api/status' , (req,res)=> res.send("Server is live"))
app.use('/api/auth' , userRouter);
app.use('/api/messages' , messageRouter);

server.listen(port , ()=>{console.log(`Server is running on PORT: ${port}`)});

