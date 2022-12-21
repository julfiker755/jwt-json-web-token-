import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';
import auth from '../../../firebase.init';
import axios from 'axios'
const style={
    width:'500px',
    margin:'auto'
}

const Checkout = () => {
    const {serviceid}=useParams()
    const [user,setuser]=useState([])
    const [address,setaddress]=useState('')
    const [phone,setphone]=useState('')
    const [authuser] = useAuthState(auth);


    useEffect(()=>{
        fetch(`http://localhost:5050/user/${serviceid}`)
        .then(res=>res.json())
        .then(data=>setuser(data))
    },[])
    // handle submit
    function Handlesubmit(e){
     e.preventDefault()
     const data={
        email:authuser?.email,
        username:user.name,
        serviceid:serviceid,
        Address:address,
        phone:phone,
     }
     axios.post('http://localhost:5050/order',data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
     
    }

    
    return (
        <div style={style}>
            <h2>User Name-{user.name}</h2>
            <hr/>
           <div style={style}>
           <form onSubmit={Handlesubmit}>
           <h1>User Name</h1>
            <h1><input  value={user?.name}  type="text" readOnly required/></h1>
            <h1>Name</h1>
            <h1><input value={authuser?.displayName} type="text" readOnly required/></h1>
            <h1>Email</h1>
            <h1><input value={authuser?.email} type="email" readOnly required/></h1>
            <h1>Address</h1>
            <h1><input onChange={(e)=>setaddress(e.target.value)} type="text"/></h1>
            <h1>Phone</h1>
            <h1><input onChange={(e)=>setphone(e.target.value)} type="text"/></h1>
            <button>add Submit</button>
           </form>
           </div>
        </div>
    );
};

export default Checkout;