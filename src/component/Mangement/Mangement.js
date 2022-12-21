import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Mangement = () => {
    const [servies,setservies]=useState([])
    const navigate=useNavigate()
    useEffect(()=>{
        fetch("http://localhost:5050/user/")
        .then(res=>res.json())
        .then(data=>setservies(data))
    },[])
    const handledelete=function(id){
        const comhandle=window.confirm('You are sure delete')
        if(comhandle){
            fetch(`http://localhost:5050/user/${id}`,{
                method:'DELETE'
            })
            .then(res=>res.json())
            .then(data=>{
                if(data.deletedCount === 1){
                    const clearuser=servies.filter(u=>u._id !== id)
                    setservies(clearuser)
                }
            })
        }
    }
    return (
        <div className='w-[500px] container mx-auto text-center'>
            <h1 className='text-[20px] font-bold text-[red]'>How to Delete this Profile</h1>
            <div>
                {servies.map(u=><li key={u._id}>{u.name}
                <button onClick={()=>handledelete(u._id)}>Delete user</button>
                <button onClick={()=>navigate(`/update/${u._id}`)}>Update user</button>
                </li>)}
            </div>
        </div>
    );
};

export default Mangement;
