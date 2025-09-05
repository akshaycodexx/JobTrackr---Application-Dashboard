import express, { Application, Request, Response } from "express";

import dotenv from 'dotenv'
import ConnectDB from './src/config/db'
import authRoutes from './src/routes/authRoutes'

import cors from 'cors'
dotenv.config();
ConnectDB();
const app:Application=express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

app.use("/api/auth",authRoutes);

app.use("/",(req:Request,res:Response)=>{
    res.send("App is Now Ready");
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server is Now Listing On Port : ",PORT);
})
