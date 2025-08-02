import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData} from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {

  const {selectedUser,messages} = useContext(ChatContext)
  const{logout , onlineUsers} = useContext(AuthContext);
 //Hold the list of urls of the images
  const [msgImages , setMsgImages] = useState([]);
 
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  },[messages]);


  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden":""}`}>
          {/* Upper section befeore hr tag */}
          <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
           {/* User Image */}
            <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
           
           {/* Username & Active */}
            <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
              {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
              {selectedUser.fullName}
            </h1>

            {/* User Bio */}
            <p className='px-10 mx-auto'>{selectedUser.bio}</p>
          </div>
              
          <hr className='border-[#ffffff50] my-4' />
          {/* After hr tag */}
           <div className='px-5 text-xs'>
            <p>Media</p>
            <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
              {msgImages.map((url,index)=>(
                <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded' >
                  <img src={url} alt="" className='h-full rounded-md' />
                </div>
              ))}
            </div>
           </div>
           {/* Button */}
           <button onClick={()=>logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer hover:from-purple-600 to-violet-400'>
            Logout
           </button>
    </div>
  )
}

export default RightSidebar