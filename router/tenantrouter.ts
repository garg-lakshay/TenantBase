import express, { Request, Response } from "express";
import prisma from "../DB/db.config";
import { JwtPayload } from "jsonwebtoken";
import authMiddleware from "../middleware/authmidddleware";

const router1 = express.Router();

// Extend Express Request to include user
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: string };
}

// ================= GET /my =================
router1.get(
  "/my",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const memberships = await prisma.membership.findMany({
        where: { userId: req.user.id },
        include: { tenant: true },
      });

      const tenants = memberships.map((m:any) => ({
        id: m.tenant.id,
        name: m.tenant.name,
        domain: m.tenant.domain,
        plan: m.tenant.plan,
        role: m.role,
      }));

      res.status(200).json({ message: "Your tenants", tenants });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  }
);

// ================= POST / =================
router1.post(
  "/",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const { name, domain, plan } = req.body;

      if (!name) {
        res.status(400).json({ message: "Tenant name is required" });
        return;
      }

      const tenant = await prisma.tenant.create({
        data: {
          name,
          domain,
          plan,
        },
      });

      await prisma.membership.create({
        data: {
          role: "ADMIN",
          tenantId: tenant.id,
          userId: req.user.id,
        },
      });

      res.status(200).json({
        message: "Tenant created successfully. You are now ADMIN.",
        tenantId: tenant.id,
        tenant,
      });
    } catch (error) {
      console.error("Error creating tenant:", error);
      res.status(500).json({ message: "Failed to create tenant" });
    }
  }
);


// Extend Express Request to include `user`
interface AuthenticatedRequest extends express.Request {
  user?: JwtPayload & { id: string };
}

// ================= POST /join =================
router1.post(
  "/join",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized: no user id found" });
        return;
      }

      const { tenantId } = req.body;

      if (!tenantId) {
        res.status(400).json({ message: "Tenant ID is required to join" });
        return;
      }

      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
      });

      if (!tenant) {
        res.status(404).json({ message: "Tenant not found" });
        return;
      }

      const existingMembership = await prisma.membership.findUnique({
        where: {
          tenantId_userId: {
            tenantId,
            userId: req.user.id,
          },
        },
      });

      if (existingMembership) {
        res
          .status(400)
          .json({ message: "You are already a member of this tenant" });
        return;
      }

      const membership = await prisma.membership.create({
        data: {
          tenantId,
          userId: req.user.id,
          role: "MEMBER",
        },
      });

      res.status(201).json({
        message: `Successfully joined tenant: ${tenant.name}`,
        tenantId: tenant.id,
        membership,
      });
    } catch (error) {
      console.error("Error joining tenant:", error);
      res.status(500).json({ message: "Failed to join tenant" });
    }
  }
);



export default router1;

