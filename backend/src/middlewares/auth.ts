import {Request ,Response , NextFunction} from 'express';
import Jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) =>{
    const token = req.headers.authorization?.split(" ")[1]; 
    if(!token){
        return res.status(401).json({message: "Not authorized"})
    }

    try {
        const decoded= Jwt.verify(token , process.env.JWT_SECRET as string);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({message:"Invalid token"})
    }
}