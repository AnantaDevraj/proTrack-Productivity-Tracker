import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        minlength : 4,
    },
    email:{
        type : String,
        required : true,
        unique : true,
        lowercase : true,
    },
    password:{
        type : String,
        required : true,
        minlength : 6,
    },
    contact:{
        type: String,
    },
    profilePic:{
        type: String,
        default: "",
    }
} , {timestamps : true});

const User = mongoose.model('User' , userSchema);
export default User;
