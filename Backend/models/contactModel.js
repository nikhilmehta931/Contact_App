import { Schema, model } from "mongoose";
const contactSchema =new Schema(
    {
        user_id:{
        type: String,
        required: true,
    },
    name :{
        type: String,
        required: true
    },
    number:{
        type: String,
        required: true,
    }
},
{ 
    timestamps: true
});

const Contact = model("Contact",contactSchema);
export default Contact;