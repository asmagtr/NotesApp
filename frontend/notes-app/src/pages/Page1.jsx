import React from 'react'
import { useNavigate } from 'react-router-dom';

const Page1 = () => {
    localStorage.setItem("valer",5);
    const navigate=useNavigate();
  return (
   

    <div>Page1
        <button onClick={()=>{
            navigate("/page2");
            
        }}> 
            go to next page 
        </button>
    </div>
  )
}

export default Page1