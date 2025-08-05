 import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import axios  from 'axios'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currentState , setCurrentState] = useState("Sign Up");
  const [fullName , setFullName] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [bio , setBio] = useState("");
  const[isDataSubmitted , setIsDataSubmitted] = useState(false);

  const{login} = useContext(AuthContext);

  const onSubmitHandler = async(e) =>{

    e.preventDefault();
      
    if(currentState === "Sign Up" && !isDataSubmitted){
      return setIsDataSubmitted(true);
    }

    login(currentState==="Sign Up" ? 'signup':'login' , {fullName , email , password , bio});


  }

  console.log(email);
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
        {/* Left Logo */}
        <img src={assets.logo_big} alt=""  className='w-65'/>


        {/* Right Form */}
        <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
          <h2 className='font-medium text-2xl flex items-center justify-between'>
            {currentState}
            {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' /> }
            
          </h2>
             
             {/* FullName field */}
           {currentState === "Sign Up" && !isDataSubmitted && 
           (<input onChange={(e)=>setFullName(e.target.value)} value={fullName} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Full Name' required />

           )}
             
             
           { !isDataSubmitted &&(
              <>
              {/* Email Field */}
              <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
              
              {/* Password Field */}
              <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
              </>
            )}
              {/*Bio Field  */}
            { currentState=== "Sign Up" && isDataSubmitted && (
              <textarea onChange={(e)=>setBio(e.target.value)}  value={bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio....' required></textarea>
            )}
            
             {/* Button */}
            <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
              {currentState === "Sign Up" ? "Create Account" : "Login Now"}
            </button>

            {/* Checkbox */}
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <input type="checkbox" required/>
              <p>Agree to the terms of use & privacy policy.</p>
            </div>


            {/* Login/Signup */}

            <div className='flex flex-col items-center gap-2'>
               {currentState === "Sign Up" ? (
                <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setCurrentState("Login");setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer underline'>Login here</span></p>
               ) : (
                <p className='text-sm text-gray-600'>Create an account? <span onClick={()=>setCurrentState("Sign Up")} className='font-medium text-violet-500 cursor-pointer underline'>Click here</span></p>
               )}
            </div>
        </form>
    </div>
  )
}

export default LoginPage
