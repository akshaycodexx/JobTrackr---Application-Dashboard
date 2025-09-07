import { Router } from "express";
import {register , login,profile} from "../controllers/authController";
import upload from "../middlewares/upload";
import authMiddleware from "../middlewares/auth";
const router=Router();

router.post("/signup", upload.single("profilePic"), register);
router.post("/login",login)
router.get("/profile",authMiddleware,profile)

export default router;