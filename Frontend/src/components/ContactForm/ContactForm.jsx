import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../../axios";
import { useNavigate, useLocation } from "react-router-dom";
const ContactForm =()=>{
    const [name,setName]=useState("")
    const [number,setNumber]=useState("")
    const navigate = useNavigate();
    const Location = useLocation();
    const route =Location.pathname.split("/")[1];
    let contact_id =null
    if(route === "update-contact"){
        contact_id=Location.pathname.split("/")[2];
    }

    const getContact = ()=>{
        axiosInstance().get("/get-contact/" + contact_id).then((res)=>{
            setName(res.data.contact.name);
            setNumber(res.data.contact.number);
        })
    }
    
    useEffect(()=>{
        if(route === "update-contact"){
            getContact();
        }
    },[])



    const addContact=(e)=>{
        e.preventDefault();
        const requestBody = {
            name,
            number,
        };

        if(route === "update-contact")
        {
            axiosInstance().patch("/update-contact/" + contact_id,requestBody).then(()=>{
                setName("");
                setNumber("");
                navigate("/");
            }
            );
        }

        else
        {
            axiosInstance().post("/add-contact",requestBody).then(()=>{
                setName("");
                setNumber("");
                navigate("/");
            }
            );
        }
        
    };
   return <form className="outer-container" onSubmit={addContact} >
        <div>
        <label htmlFor="">Name:</label>
        <input type="text" name="name" id="name" 
        onChange={(e)=>{
            setName(e.target.value)
        }} 
        value={name}/>
    </div>
    <div>
        <label htmlFor="">Number:</label>
        <input type="text" name="number" id="number" 
        onChange={(e)=>{
            setNumber(e.target.value)
        }} 
        value={number}/>
    </div>
    <button type="submit">{route === "update-contact" ? "Update":"Add"}</button>
    </form>
};

export default ContactForm;