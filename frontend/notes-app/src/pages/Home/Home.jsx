import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import NoteCard from '../../components/NoteCard'
import Modal from 'react-modal'
import { MdAdb } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosinstance'
import { Toast } from '../../components/Toast'


const Home = () => {
  const [openAddEditModal,setOpenAddEditModal]=useState({isShown:false,
    type:"add",
    data:null,
  });

  const [userInfo,setUserInfo]=useState(null);
  const [allNotes,setAllNotes]=useState([]);

  const [showToastMsg,setShowToastMsg]=useState({
    isShown:false,
    type:"add",
    data:null,
  });
  const navigate = useNavigate();

  const handleEdit=(noteDetails)=>{
    setOpenAddEditModal({isShown:true, data:noteDetails,type:"edit"})
  };

  const showToastMessage=(message,type)=>{
    setShowToastMsg({
      isShown:true,
      message:message,
      type:type
    });
  };

  const handleCloseToast=()=>{
    setShowToastMsg({
      isShown:false,
      message:"",
    });
  };

  //Get User Info

  const getUserInfo= async()=>{
    try{
      console.log("we re in getUserInfo");
      console.log("******* getting the token:   "+localStorage.length);
      const response = await axiosInstance.get("/get-user",{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(`\\\\\\\\\\\\ response
        ${response}///////////`);


      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }catch(error){
      console.log(error);
      if(error.response.status==401){
        console.log(`\\\\\\\\\localstorage${localStorage.getItem("token")} ///`)
        localStorage.clear();
       navigate("/login");
      }
    }
  };

  //Get All notes

  const getAllNotes=async()=>{
      try{
        const response=await axiosInstance.get("/get-all-notes");
        console.log(response)

        if (response.data && response.data.notes ){

          setAllNotes(response.data.notes);

        }
      }catch(error){
        console.log("An unexpected error occured. please try again.");
      };
  }
 

  useEffect(()=>{
  
    getUserInfo();
    getAllNotes();
    return()=>{}
  },[]);



  return (
    <>
    <Navbar userInfo={userInfo}/>
    <div className='container mx-auto '>
      <div className='grid grid-cols-3 gap-4 mt-8'>

        {allNotes.map((item,index)=>(
              <NoteCard 
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onDelete={()=>{}}
              onEdit={()=>{handleEdit(item)}}
              onPinNote={()=>{}}
              />
        ))}
  
      
      </div>

    </div>
    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' onClick={()=>{
       setOpenAddEditModal({isShown:true, type:"add",data:null})
    }}>
      <MdAdb className='text-[32px] text-white'/>
    </button>

    <Modal 
    isOpen={openAddEditModal.isShown}
    onRequestClose={()=>{
     
    }}
    style={{
      overlay:{
        backgroundColor:"rgba(0,0,0,0.2)",
      },
    }}
    contentLabel=""
    className="w-[40%] max-h-3/4 bg-white roundedd-md mx-auto mt-14 p-5 overflow-scroll">
         <AddEditNotes 
         type={openAddEditModal.type}
         noteData={openAddEditModal.data}
         onClose={()=>{
          setOpenAddEditModal({isShown:false, type:"add", data:null})
         }}
         getAllNotes={getAllNotes}
         showToastMessage={showToastMessage}/>

    </Modal>

         <Toast
         isShown={showToastMsg.isShown}
         message={showToastMsg.message}
         type={showToastMsg.type}
         onClose={handleCloseToast}
         />

 

    </>
  )

}

export default Home