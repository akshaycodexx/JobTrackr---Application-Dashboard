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

const allowedOrigins = [
  'http://localhost:5173', // dev
  'https://job-track-pi.vercel.app' // production frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin like Postman
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // allow cookies
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
