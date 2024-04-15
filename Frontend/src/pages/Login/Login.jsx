import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import "./Login.css"
import axiosInstance from "../../axios";

const Login= ()=>{
    const navigate = useNavigate();
    const [username, setUsername]=useState("")
    const [password, setPassword]=useState("")
    const adduser = (e)=>{
        e.preventDefault();
        const requestBody ={
            username,
            password,
        }
        axiosInstance().post("/login", requestBody).then((res)=>{
            setUsername("");
            setPassword("");
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
            navigate("/home");

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
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" id="username" 
        onChange={(e)=>{
            setUsername(e.target.value)
        }} 
        value={username}/>
    </div>

    <div>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" 
        onChange={(e)=>{
            setPassword(e.target.value)
        }} 
        value={password}/>
    </div>

    <button type="submit">Submit</button>
    <p>New Here, <a href="/register">Register</a></p>
    <ToastContainer />
 </form>
 </>
};
export default Login;
