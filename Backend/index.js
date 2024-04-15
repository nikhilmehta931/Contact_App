import express, { json } from "express";
import cors from "cors"
import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/userModels.js";
import Contact from "./models/ContactModel.js";
import axiosInstance from "../Frontend/src/axios.js";
 

const app = express();
const PORT = 4000;

app.use(cors());
app.use(json());

// Connecting to MongoDB
// Enter ur own URL of mongodb to connect to the database
mongoose.connect("mongodb://127.0.0.1:27017/contacts").then(() => {
    console.log("Database connected succesfully");
})

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "API Running Successfully!",
    });
});

const generateToken=(user_id)=>{
    const token = jwt.sign(
        {
        user_id: user_id
        }, 
        'secret', 
        { expiresIn: '1d' }
        );
    
    return token;
}

const checkToken= (req,res,next)=>{
// console.log(req.headers);
let token = req.headers.authorization;

//token is present or not
if(!token){
    return res.status(401).json({
        message: "Unauthorized user!"
    })
}

//validity of token 
try{
    token = token.split(" ")[1];
    let decodeToken= jwt.verify(token,"secret");
    req.user_id=decodeToken.user_id;
    next();
}
catch{
    return res.status(401).json({
        message :"Unauthorized user",
    })
}

};

//User Api

app.post("/register", (req, res) => {
    // console.log(req.body);
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    if (!name || !username || !password) {

        return res.status(400).json({
            message: "All Fields cannot be empty",
        })
    }

    User.findOne({
        username: username,
    }).then((data, err) => {
        if (err) {
            return res.status(500).json({
                message: "Internal server Error",
            });
        }

        else if (data) {
            return res.status(409).json({
                message: "Username is already in use",
                user: data
            });
        }
        else {
            const saltRounds =10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const encryptedPassword =bcrypt.hashSync(password, salt);
            User.create({
                name: name,
                username: username,
                password: encryptedPassword

            }).then((data, err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Internal server Error",
                    });
                }

                if (data) {
                    console.log(data)
                    return res.status(200).json({
                        message: "User registered Successfully!",
                        token: generateToken(data._id)
                    })
                }
            });
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {

        return res.status(400).json({
            message: "All Fields cannot be empty",
        })
    }

    User.findOne({
        username: username
    }).then((data, err) => {
        if (err) {
            return res.status(500).json({
                message: "Internal server Error",
            });
        }

        if (data) {
           const isMatch= bcrypt.compareSync(password,data.password);
           if(isMatch){
            return res.status(201).json({
                message: "User validated successfully",
                user: data,
                token: generateToken(data._id)
            });
           }
           else
           {
            return res.status(404).json({
                message: "Inavlid credentials!",
            });  
           }
           
        }
        else {
            return res.status(404).json({
                message: "User not found",
            });
        }
    })
});

//Contacts API

app.post("/add-contact",checkToken, (req, res) => {
    const user_id = req.user_id;
    const name = req.body.name;
    const number = req.body.number;

    if( !name || !number){
        return res.status(401).json({
            message : "Please fill all the fields",
        })
    }

    Contact.create({
        user_id: user_id,
        name: name,
        number: number
    }).then((data, err) => {
        if (err) {
            return res.status(500).json({
                message: "Internal server Error",
            });
        }

        if (data) {
            return res.status(201).json({
                message: "Contacts added succesfully",
                contact: data
            });
        }

    })
});

app.get("/get-contacts",checkToken, (req, res) => {

    const user_id = req.user_id;
    //const user_id = req.params.user_id;

    // if(!user_id){
    //     return res.status(400).json({
    //         message: "PLease fill all the fields"
    //     });
    // }

    Contact.find({
        user_id: user_id,
    }).then((data, err) => {
        if (err) {
            return res.status(500).json({
                message: "Internal server Error",
            });
        }

        if (data) {
            return res.status(201).json({
                message: "Contacts fetched succesfully",
                contacts: data
            });
        }

    })
});


app.patch("/update-contact/:contact_id",checkToken, (req, res) => {
    const contact_id = req.params.contact_id;
    const number = req.body.number;

    if (!contact_id || !number) {
        return res.status(400).json({
            message: "field cannot be empty",
        })
    }
Contact.findById({_id: contact_id}).then((data,err)=>{
    if (err) {
        return res.status(500).json({
            message: "Internal server Error",
        });
    }
    if(data){
        // if(data.user_id !== req.user_id){
        //     return res.status(404).json({
        //         message: "Contact not Found",
        //     })
        // }
        // else{
        Contact.findByIdAndUpdate(
        { _id: contact_id },
        { number: number },
        { new: true }
    ).then((data, err) => {
        if (err) {
            return res.status(500).json({
                message: "Internal server Error",
            });
        }

        if (data) {
            return res.status(200).json({
                message: "Contacts updated succesfully",
                contacts: data
            });
        }

    })
        }
    }
)

    
});

app.delete("/delete-contact/:contact_id",checkToken, (req, res) => {
    const contact_id = req.params.contact_id
    Contact.findById({_id: contact_id}).then((data,err)=>{
        if (err) {
            return res.status(500).json({
                message: "Internal server Error",
            });
        }
        if(data){
            if(data.user_id !== req.user_id){
                return res.status(404).json({
                    message: "Contact not Found",
                })
            }
            else{
                Contact.findByIdAndDelete(contact_id).then((data, err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Internal server Error",
                        });
                    }
            
                    if (data) {
                        return res.status(200).json({
                            message: "Contacts deleted succesfully",
                            contact: data
                        });
                    }
                    else {
                        return res.status(404).json({
                            message: "Contact not Found",
                        })
                    }
            
                })
            }
        }
        else {
            return res.status(404).json({
                message: "Contact not Found",
            })
        }
    })
   
});

app.get("/get-contact/:contact_id",checkToken, (req, res) => {
    const contact_id = req.params.contact_id
    Contact.findById(contact_id).then((data, err) => {
        if (err) {
            return res.status(500).json({
                message: "Internal server Error",
            });
        }
        if (data) {
            if(data.user_id !== req.user_id){
                return res.status(404).json({
                    message: "contacts not found"
                })
            }
            
            return res.status(200).json({
                message: "Contact fetched succesfully",
                contact: data
            });
        }
        else {
            return res.status(404).json({
                message: "Contact not Found",
            })
        }

    })
});

app.port
app.listen(PORT, () => {
    console.log("Listening On PORT : " + PORT);
});

