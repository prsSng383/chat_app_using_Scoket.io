import {createContext, useEffect, useState} from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;


export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

        // Check if the Browser is having the token using the localStorage of the browser.
        const[token , setToken] = useState(localStorage.getItem("token"));
        
        // If user is logedIn get the userData.
        const[authUser , setAuthUser] = useState(null); 
        const[onlineUsers , setOnlineUsers] = useState([]);
        const[socket , setSocket] = useState(null);
        
        //Check if the user is Authenticated.
        const checkAuth = async()=>{
           
            try {
                const {data} = await axios.get("/api/auth/check");
                if(data.success){
                    setAuthUser(data.user);
                    connectSocket(data.user);
                }
            } catch (error) {
                toast.error(error.message);
            }
            
        }

        //Login function to handel user authenticastion and socket connection.
        // Here state is either login OR signup , and credentials will be the object having the data for the 
        // perticular state.

        const login = async(state , credentials)=>{

            try {
                const{data} = await axios.post(`/api/auth/${state}`,credentials);
                if(data.success){
                    console.log("login triggered")
                    setAuthUser(data.userData);
                    console.log(authUser);
                    connectSocket(data.userData);
                    console.log()
                    axios.defaults.headers.common["token"] = data.token;
                    setToken(data.token);
                    localStorage.setItem("token" , data.token);
                    toast.success(data.message); 
                }else{
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error);
            }
            
        }
        
        //Logout function to handel user logout and socket discconect.
        const logout = async() =>{
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            setOnlineUsers([]);
            axios.defaults.headers.common["token"] = null;
            toast.success("Logged out successfully");
            socket.disconnect();
        }
        
        //Update profile function to handel user profile updates.
        // body object will conatin all the data nedded by the backend to update the profile.
        const updateProfile = async(body) =>{
            
            try {
                const {data} = await axios.put("/api/auth/update-profile" , body);
                console.log(data);
                if(data.success){
                    setAuthUser(data.user);
                    toast.success("Profile Updated Successfully!")
                }
            } catch (error) {
                toast.error(error.message);
            }
        }

        //Connect socket function to handel socket connection and online users updates.
        const connectSocket = (userData) =>{
                   if(!userData || socket?.connected) return;

                   const newSocket = io(backendUrl , {
                    query:{
                        userId: userData._id,
                    }
                   });
                   newSocket.connect();
                   setSocket(newSocket);

                   newSocket.on("getOnlineUsers" , (userIds)=>{
                    setOnlineUsers(userIds);
                   })
        }
        
        useEffect(()=>{
            if(token){

                //If the token exists in the localStorage , then for every api request made using axios it will
                // set the token value with the value in the localStorage.
                axios.defaults.headers.common["token"] = token;
                
            }
           checkAuth();
        },[token])

        const value = {
            axios,
            authUser,
            onlineUsers,
            socket,
            login,
            logout,
            updateProfile
        }


        return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        )
}