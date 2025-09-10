import {Request ,Response , NextFunction} from 'express';
import Jwt from 'jsonwebtoken';

interface AuthRequest extends Request{
    userId?:any;
}

const authMiddleware = ( req: AuthRequest,res: Response,next: NextFunction)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ message:"No token provided" });

    }

    const token=authHeader.split(" ")[1];
    try {
        const decoded=Jwt.verify(token,process.env.JWT_SECRET!) as {id:string};
        req.userId = decoded.id;
        next();
        
    } catch (error) {
         return res.status(401).json({ message: "Invalid token" });
    }

}
export default authMiddleware;