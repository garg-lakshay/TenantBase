import express, { Response } from "express";
import prisma from "../DB/db.config";
import { JwtPayload } from "jsonwebtoken";
import authMiddleware from "../middleware/authmidddleware";

const router2 = express.Router();

// Extend Request type to include user
interface AuthenticatedRequest extends express.Request {
  user?: JwtPayload & { id: string };
}

// Create Task
router2.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const { projectId, title, description, assigneeId } = req.body;

      if (!projectId || !title) {
        res
          .status(400)
          .json({ message: "Project ID and title are required" });
        return;
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      const membership = await prisma.membership.findUnique({
        where: {
          tenantId_userId: {
            tenantId: project.tenantId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        res
          .status(403)
          .json({ message: "You are not a member of this tenant" });
        return;
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          projectId,
          assigneeId,
        },
      });

      res
        .status(201)
        .json({ message: "Task created successfully", task });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  }
);

// Get Tasks by Project
router2.get(
  "/:projectId",
  authMiddleware,
  async (
    req: AuthenticatedRequest & { params: { projectId: string } },
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const { projectId } = req.params;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      const membership = await prisma.membership.findUnique({
        where: {
          tenantId_userId: {
            tenantId: project.tenantId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        res
          .status(403)
          .json({ message: "You are not a member of this tenant" });
        return;
      }

      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  }
);

// Update Task
router2.put(
  "/:taskId",
  authMiddleware,
  async (
    req: AuthenticatedRequest & { params: { taskId: string } },
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const { taskId } = req.params;
      const { title, description, status, assigneeId } = req.body;

      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: { project: true }, // ✅ ensures task.project is available
      });

      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }

      const membership = await prisma.membership.findUnique({
        where: {
          tenantId_userId: {
            tenantId: task.project.tenantId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        res
          .status(403)
          .json({ message: "You are not a member of this tenant" });
        return;
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { title, description, status, assigneeId },
      });

      res
        .status(200)
        .json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  }
);

export default router2;
