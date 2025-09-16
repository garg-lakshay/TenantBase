import express, { Response } from "express";
import prisma from "../DB/db.config";
import { JwtPayload } from "jsonwebtoken";
import authMiddleware from "../middleware/authmidddleware";

const router3 = express.Router();


interface AuthenticatedRequest extends express.Request {
  user?: JwtPayload & { id: string };
}


router3.post("/",authMiddleware,async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { name, tenantId } = req.body;

      if (!tenantId || !name) {
        res.status(400).json({ message: "Tenant ID and Project name are required" });
        return;
      }

      if (!req.user?.id) {res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const membership = await prisma.membership.findUnique({
        where: {
          tenantId_userId: {
            tenantId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        res.status(403).json({ message: "You are not a member of this tenant" });
        return;
      }

      if (membership.role !== "ADMIN") {
        res.status(403).json({ message: "Only admins can create projects" });
        return;
      }

      const project = await prisma.project.create({
        data: {
          name,
          tenantId,
        },
      });

      res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  }
);


router3.get("/list/:tenantId",authMiddleware,async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const { tenantId } = req.params;
      if (!tenantId) {
        res.status(400).json({ message: "Tenant ID is required" });
        return;
      }


      const membership = await prisma.membership.findUnique({
        where: {
          tenantId_userId: {
            tenantId:tenantId,
            userId: req.user.id,
          },
        },
      });

      if (!membership) {
        res.status(403).json({ message: "You are not a member of this tenant" });
        return;
      }

      const projects = await prisma.project.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  }
);

export default router3;
