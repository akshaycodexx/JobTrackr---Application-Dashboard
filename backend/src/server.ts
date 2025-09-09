import express, { Application, Request, Response } from "express";

import dotenv from 'dotenv'
import ConnectDB from './config/db'
import authRoutes from './routes/authRoutes'
import appllicationRoutes from './routes/applicationRoutes'

import cors from 'cors'
dotenv.config();
ConnectDB();
const app:Application=express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/applications",appllicationRoutes);

app.use("/",(req:Request,res:Response)=>{
    res.send("App is Now Ready");
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server is Now Listing On Port : ",PORT);
})
