import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
 
const Sidebar = () => {

   const navigate = useNavigate();
   const[input , setInput] = useState(false);
   const {logout , onlineUsers} = useContext(AuthContext);
   const{getUsers , users,selectedUser,setSelectedUser,unseenMessages , setUnseenMessages} = useContext(ChatContext); 
 
   // Filtering the user based you type in search box in leftSidebar.
   const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase()) ) : users;

   
   useEffect(()=>{
    getUsers();
   },[onlineUsers])

   return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ""} `}>
      <div className='pb-5'>
        {/* Logo and Menu */}
        <div className='flex justify-between items-center'>
            <img src={assets.logo} alt="logo" className='max-w-40' />
            <div className='relative py-2 group'>
              <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer' />
              <div className='absolute top-1/1.25 right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>

                <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
                <hr className='my-2 border-t border-gray-500' />
                <p onClick={()=>logout()} className='cursor-pointer text-sm'>Logout</p>

              </div>
            </div>
        </div>

        {/* Search Box */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 mt-5 px-4 py-3'>
          <img src={assets.search_icon} alt="search" className='w-3' />
          <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search Users....' />
        </div>
      </div>
      
      {/* Users List */}
      <div className='flex flex-col'>
        {filteredUsers.map((user , index)=>(
          // ()=>setSelectedUser(user) , here we are passing the whole user:{} object, but how the setSelectedUser() in HomePage.jsx
         // is becoming "true" ,The logic is JS concept Truthy/Falsy , 
         // Falsy values: false , 0 , "" ,null , undefined , NaN
         // Truthy values: {} , {name:"Paras"} , [] , "hello" ,123.
         //So as we are intializing the selectedUser as "false" in the HomePage.jsx, but here as soon as we are passing
         // the "user" as Object in the setSelectedUser(user) on onClick , the value chages to Truthy which means become true.
         // that is why this line:  '${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2' }`}> '.
         // in the HomePage.jsx is executing the true statement.  
          <div  key={index} onClick={()=>{setSelectedUser(user) ; setUnseenMessages(prev=>({...prev , [user._id]:0})) }}  className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-[#282142]/50"}`}>
              <img src={user?.profilePic || assets.avatar_icon} alt="user_image" className='w-[35px] aspect-[1/1] rounded-full'/>
                 
              <div className='flex flex-col leading-5'>
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id)? <span className='text-green-400 text-xs'>Online</span> : <span className='text-neutral-400 text-xs'>Offline</span>}
              </div>
              
              {unseenMessages[user._id] > 0 && <p className='absolute right-4 top-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenMessages[user._id]}</p>}
          </div>
        ))}

      </div>

    </div>
  )
}

export default Sidebar