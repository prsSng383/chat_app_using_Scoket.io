import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import asset from '../assets/assets.js'
import { AuthContext } from '../../context/AuthContext.jsx'

const ProfilePage = () => {

  const{authUser , updateProfile} =  useContext(AuthContext);


  const [selectedImage , setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name , setName] = useState(authUser.fullName);
  const [bio , setBio] = useState(authUser.bio);

  const MAX_SIZE = 20 * 1024 * 1024; // 20MB

  const onChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file.size > MAX_SIZE) {
      toast.error("Image too large! Max 20MB.");
      return;
    }
    setSelectedImage(file);
  };

  
  const onSubmitHandler = async(e) =>{
        console.log("Handler trggered!")
    e.preventDefault();

     if(!selectedImage){
      await updateProfile({fullName:name , bio})
       navigate("/");
       return;
    }
   //Converting the selected image as base64Image.
    const reader = new FileReader();
    console.log(reader);
    reader.readAsDataURL(selectedImage);
    reader.onload = async()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic:base64Image , fullName:name , bio});
      navigate("/");
    }
   
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        
        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 p-10 flex-1'>
          {/* Heading */}
          <h3 className='text-lg'>Profile Details</h3>

          {/* Pic and FileUpload */}
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImage(e.target.files[0]) ; onChangeHandler} type="file" id='avatar' accept='.png,.jpg,.jpeg' hidden />
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : asset.avatar_icon} alt="" className={`w-12 h-12 ${selectedImage && "rounded-full"}`} />
            Upload Profile Image!
          </label>

           {/*Input Name  */}
          <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
        
          {/* Bio Text */}
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Write Profile Bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
       
          {/* Button */}

          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>

        {/* Logo */}
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} src={authUser?.profilePic || asset.logo_icon} alt=""/>
      </div>
    </div>
  )
}

export default ProfilePage
