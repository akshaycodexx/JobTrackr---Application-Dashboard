import { Request , Response } from "express";
import User from '../models/User';
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config()


export const register = async (req:Request , res:Response ):Promise<void>=>{
    try {
        const {name,email,password}=req.body;
        const userExists = await User.findOne({ email });
        if(userExists){
            res.status(400).json({message:"User Already exits"});
            return;
        }
        const gensalt =await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,gensalt);

        let profileUrl="";

        if((req as any).file){
            const uploadPic= await cloudinary.uploader.upload((req as any).file.path,{
                folder:"profilePicture"
            })
            profileUrl=uploadPic.secure_url;
        }
        const newUser= new User({
            name,
            email,
            password:hashedPassword,
            profileUrl:profileUrl
        })
        await newUser.save();

        const token = Jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User Registered Successfully !!",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profileUrl: newUser.profileUrl
            }
        });
    } catch (error) {
        res.status(500).json({message:"User Registration Failed !!"});
        console.log("Signup Contraoller failed",error);
    }
}



export const login = async (req:Request , res:Response ):Promise<void>=>{
    try {
        const {email,password}= req.body;
        const existingUser= await User.findOne({email});
        if(!existingUser){
            res.status(400).json({message:"User Not Found !!"});
            return ;
        }
        const match = await bcrypt.compare(password,existingUser.password);
        if(!match){
            res.status(400).json({message:"Password not match"});
            return ;
        }

        const token = Jwt.sign({id:existingUser._id},process.env.JWT_SECRET as string,{expiresIn:"7d"});

        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message:"Login successful",
            token,
            user:{
                id:existingUser._id,
                name:existingUser.name,
                email:existingUser.email,
                profileUrl:existingUser.profileUrl
            },
        });
        
    } catch (error) {
    console.log("Login Controller failed", error);
    res.status(500).json({ message: "Login Failed !!" });
    }
}


export const profile = async(req:any,res:any)=>{
    try {
        const user= await User.findById(req.userId).select("name email profileUrl ");
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        res.json(user);
    } catch (error) {
         res.status(500).json({ message: "Server error" });
    }
}
































