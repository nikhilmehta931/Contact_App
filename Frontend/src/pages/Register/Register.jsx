import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "./Register.css"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";

const Register= ()=>{
    const navigate = useNavigate();
    const [name, setName]=useState("")
    const [username, setUsername]=useState("")
    const [password, setPassword]=useState("")
    const adduser = (e)=>{
        e.preventDefault();
        const requestBody ={
            name,
            username,
            password,
        }
        axiosInstance().post("/register", requestBody).then((res)=>{
            setName(null);
            setUsername(null);
            setPassword(null);
            toast.success(res.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
            const token = res.data.token;
            localStorage.setItem("token",token);
            navigate("/");
        }).catch((err)=>{
            toast.error(err.response.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        })
    };
 return <>
 <form onSubmit={adduser} className="form-container">
    <div>
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="name" 
        onChange={(e)=>{
            setName(e.target.value)
        }}
        value={name}/>
    </div>
    
    <div>
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" id="username" 
        onChange={(e)=>{
            setUsername(e.target.value)
        }}
        value={username} />
    </div>

    <div>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" 
        onChange={(e)=>{
            setPassword(e.target.value)
        }}
        value={password} />
    </div>

    <button type="submit">Submit</button>
    <p>Already Have a account,<a href="/login">Login</a></p>
    <ToastContainer />
 </form>
 </>
};
export default Register;
