import mongoose  from 'mongoose';
import {Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name:string,
    email:string,
    password:string,
    profileUrl?:string
}

const userSchmea= new Schema<IUser>({
    name:{
        type:String,
        required:[true,"Name is required!"]
    },
    email:{
        type:String,
        required:[true,"Email is required!"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required!"]
    },
    profileUrl:{
        type:String
    },
}, {timestamps:true})
export default mongoose.model<IUser>("User",userSchmea)