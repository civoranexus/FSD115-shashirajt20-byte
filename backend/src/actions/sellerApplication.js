// src/actions/sellerApplication.js
import prisma from "../lib/prisma.js";

export async function applySellerHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { store_name, gst_number, documents, reason } = req.body;
    if (!store_name) return res.status(400).json({ success: false, message: "store_name required" });

    // ensure user hasn't applied already
    const existing = await prisma.sellerApplication.findUnique({ where: { userId } });
    if (existing) {
      return res.json({ success: false, message: "Application already submitted", application: existing });
    }

    const app = await prisma.sellerApplication.create({
      data: {
        user: { connect: { id: userId } },
        store_name,
        gst_number: gst_number ?? null,
        documents: documents ?? null,
        reason: reason ?? null,
      }
    });

    return res.json({ success: true, application: app });
  } catch (err) {
    console.error("applySellerHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getMySellerApplication(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false });

    const app = await prisma.sellerApplication.findUnique({ where: { userId } });
    return res.json({ success: true, application: app || null });
  } catch (err) {
    console.error("getMySellerApplication error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

// admin endpoints
export async function getPendingSellerApplications(req, res) {
  try {
    if (!req.user || req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "Admin required" });

    const apps = await prisma.sellerApplication.findMany({
      where: { status: "PENDING" },
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });
    return res.json({ success: true, applications: apps });
  } catch (err) {
    console.error("getPendingSellerApplications error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function approveSellerApplication(req, res) {
  try {
    if (!req.user || req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "Admin required" });

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "id required" });

    const app = await prisma.sellerApplication.findUnique({ where: { id } });
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    // update application status
    await prisma.sellerApplication.update({ where: { id }, data: { status: "APPROVED", reject_note: null } });

    // set user role to SELLER and mark verified
    await prisma.user.update({ where: { id: app.userId }, data: { role: "SELLER", is_seller_verified: true } });

    return res.json({ success: true });
  } catch (err) {
    console.error("approveSellerApplication error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function rejectSellerApplication(req, res) {
  try {
    if (!req.user || req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "Admin required" });

    const id = Number(req.params.id);
    const { reason } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "id required" });

    const app = await prisma.sellerApplication.findUnique({ where: { id } });
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    await prisma.sellerApplication.update({ where: { id }, data: { status: "REJECTED", reject_note: reason ?? null } });
    return res.json({ success: true });
  } catch (err) {
    console.error("rejectSellerApplication error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
