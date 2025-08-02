import { createContext, useContext, useEffect, useState } from "react"
import {AuthContext} from "./AuthContext.jsx"
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
   
    //Store the messages
   const [messages , setMessages] = useState([]);
  
   //We will store the list of users for the left SideBar.
   const[users , setUsers] = useState([]);
  
   //It will store the userId of the user that we will click from the left sidebar.
   const [selectedUser , setSelectedUser] = useState(null);
   
   //Here we will store the key:value pair with userId:no.of unseenMessages.
   const[unseenMessages , setUnseenMessages] = useState({});


   // getting the socket and axios from AuthContext.
   const{socket , axios} = useContext(AuthContext);

   //function to get all users for sidebar
   const getUsers = async()=>{
      try {
        const{data} = await axios.get('/api/messages/user');
        if(data.success){
          setUsers(data.users);
          setUnseenMessages(data.unseenMessages)
        }
      } catch (error) {
        toast.error(error.message);
      }
    

   }

   //function to get messages for selected user.
   const getMessages = async(userId) =>{
    try {
        const {data} = await axios.get(`/api/messages/${userId}`)
        if(data.success){
            setMessages(data.messages);
        }
    } catch (error) {
        toast.error(error.message);
    }
   }

   //function to send message to selected user.
   const sendMessage = async(messageData)=>{
    try {
        const{data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
        if(data.success){
            setMessages((prevMessages)=>[...prevMessages , data.newMessage])
        }else{
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
   }

   //function to subscribe to messages in real time.
   const subscribeToMessages = async() =>{
       if(!socket) return;

       socket.on("newMessage" , (newMessage)=>{
        //It means the chatbox is open for the selected user.
        if(selectedUser && newMessage.senderId === selectedUser._id){
             newMessage.seen = true;
             setMessages((prevMessages)=>[...prevMessages , newMessage]);
             axios.put(`/api/messages/mark/${newMessage._id}`);
        }else{
            setUnseenMessages((prevUnseenMessages)=>({
                ...prevUnseenMessages,
                [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
            }))
        }
       })
   }

   //function to unsubscribe from the messages.
   const unsubscribeFromMessages= ()=>{
          if(socket) socket.off("newMessage");
   }


   useEffect(()=>{
    subscribeToMessages();
    return ()=>unsubscribeFromMessages();
   },[socket ,selectedUser])

 const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages
 }

  return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
  )
}
