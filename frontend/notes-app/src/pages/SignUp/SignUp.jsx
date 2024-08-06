import React from 'react'
import Navbar from '../../components/Navbar'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';


const SignUp = () =>{
  const navigate=useNavigate();

  // const handleSignUp = async(e)=>{
  //   e.preventDefault();

  //   if(!name){
  //     setError("Please enter your name.");
  //     return ;
  //   }
  //   if(!validateEmail(email)){
  //     setError("please enter a valid email address.");
  //     return;
  //   }

  //   if(!password){
  //     setError("Please enter the password");
  //     return;
  //   }

  //   setError(null);
  //   //Signup api call

  //   try {
  //     const response = await axiosInstance.post("/create-account", {
  //       email: email,
  //       password: password,
  //       fullName: name,
  //     });
  //     // Handle successful registration response

  //     if (response.data && response.data.error){
  //       setError(response.data.error);
  //       return;
  //     }

  //     if (response.data && response.data.accessToken) {
  //       console.log("helllllo")
  //       localStorage.setItem("token", response.data.accessToken);
  //       navigate("/dashboard");
  //     }
  //   } catch (error) {
  //     // Handle login error
  //     if (
  //       error.response &&
  //       error.response.data &&
  //       error.response.data.message
  //     ) {
  //       setError(error.response.data.message);
  //     } else {
  //       setError("An unexpected error occurred. Please try again.");
  //     }
  //   }
  

  // };
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  const [name,setName]=useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
    // SignUp API Call using an axios instance with auth token attached
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,

      });


      // handle successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
      if (response.data && response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
          navigate("/dashboard");
      }
     

    } catch (error) {
      // handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };
  return (
    <>
  <Navbar />
  <div className='flex items-center justify-center mt-28'>
    <div className='w-96 border rounded bg-white px-7 py-10'>
      <form onSubmit={handleSignUp} >
        <h4 className='text-2xl mb-7 '>
          SignUp
        </h4>

        <input type='text' placeholder='Name' className='input-box' 
        value={name}
        onChange={(e)=>setName(e.target.value)}/>

        <input type='text' placeholder='Email' className='input-box' 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}/>

        
        <PasswordInput value={password}
        onChange={(e)=> (setPassword(e.target.value))}/>

{error && <p className='text-red-400 text-xs pb-1'>{error}</p> }

<button type='submit' className='btn-primary'>
  SignUp
</button>

<p className='text-sm text-center mt-4'>
  Already have an account? <Link to="/login" className="font-medium text-primary underline" >
Login
</Link>
</p>
        </form>
      </div>
  </div>
  </>    
  )
}

export default SignUp
