import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import auth from '../../firebase.init';
import { signOut } from 'firebase/auth';
const style={
    with:'800px',
    margin:'auto'
}
const Order = () => {
    const [user] = useAuthState(auth);
    const [order1,setorder1]=useState([])
    const navigate=useNavigate()
    useEffect(()=>{
        const getdata=async()=>{
           try{
            const url=`http://localhost:5050/order?email=${user?.email}`
            const {data}=await axios.get(url,{
                headers:{
                    authorization:`Bearer ${localStorage.getItem('accestoken')}`
                }
            })
            setorder1(data)
           }
           catch(error){
            if(error.response.status === 401 || error.response.status === 403){
                signOut(auth)
                navigate("/login")
            }
           }
        }
        getdata()
    },[user])
    console.log(order1)

    return (
        <div style={style}>
            <h1>Your Order item-{order1.length}</h1>
           
        </div>
    );
};

export default Order;