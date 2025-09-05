import { Router } from "express";
import {register , login} from "../controllers/authController";

import upload from "../middlewares/upload";
const router=Router();

router.post("/signup",upload.single("profile"),register);
router.post("/login",login)

export default router;