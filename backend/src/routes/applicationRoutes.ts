import express from 'express';
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
} from "../controllers/applicationController";
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.post("/", authMiddleware, createApplication);
router.get("/", authMiddleware, getApplications); 
router.put("/:id", authMiddleware, updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);

export default router;