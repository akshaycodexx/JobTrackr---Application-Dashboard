import { Request, Response } from "express";
import Application from "../models/Application";

// Define an interface for requests that have been authenticated
// This gives us type safety for req.userId
interface AuthRequest extends Request {
  userId?: string;
}

// Create Application - Fixed
export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log("👉 Body received:", req.body);
    console.log("👉 User ID from token:", req.userId);
    const { company, position, appliedDate, status, notes } = req.body;

    const newApplication = new Application({
      company,
      position,
      status: status || "Applied",
      appliedDate: appliedDate || new Date(),
      notes,
      user: req.userId,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: "Application creation failed!" });
    console.error(error);
  }
};

// Get All Applications of Logged-in User - Fixed
export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    const applications = await Application.find({ user: req.userId }).sort({ appliedDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications!" });
    console.error(error);
  }
};

// Update Application - Fixed
export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    const { id } = req.params;
    const { company, position, status, appliedDate, notes } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    if (application.user.toString() !== req.userId) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const updateData: any = {};
    if (company !== undefined) updateData.company = company;
    if (position !== undefined) updateData.position = position;
    if (status !== undefined) updateData.status = status;
    if (appliedDate !== undefined) updateData.appliedDate = appliedDate;
    if (notes !== undefined) updateData.notes = notes;

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Application updated successfully", application: updatedApplication });
  } catch (error) {
    res.status(500).json({ message: "Application update failed!" });
    console.error(error);
  }
};

// Delete Application - Fixed
export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Use req.userId
    const userId = req.userId;
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      res.status(404).json({ message: "Application not found!" });
      return;
    }

    if (application.user.toString() !== userId) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    await Application.findByIdAndDelete(id);
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Application deletion failed!" });
    console.error(error);
  }
};