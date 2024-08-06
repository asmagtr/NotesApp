import React, { useState } from 'react'
import ProfileInfo from './ProfileInfo'
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Navbar = ({userInfo }) => {
    const isToken = localStorage.getItem("token");
    const navigate= useNavigate();
    const onLogOut=()=>{
     
  
        navigate("/login");
        localStorage.clear();
    };
    const [searchQuery,setSearchQuery]=useState("");
    const onClearSearch=()=>{
        setSearchQuery("");
    };
    const handleSearch=()=>{

    };
  return (

    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
    <h2 className="text-xl font-medium text-black py-2">Notes</h2>
    {isToken && (
      <>
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
        <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
      </>
     )}
  </div>
  )
}

export default Navbar