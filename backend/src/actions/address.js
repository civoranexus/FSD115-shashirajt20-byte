// src/actions/address.js
import prisma from "../lib/prisma.js";

export async function getAddressesHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false });
    const addresses = await prisma.address.findMany({
      where: { /* no user field here; you use UserAddress relation */ },
    });

    // Since you have UserAddress join table, query via userAddress:
    const rows = await prisma.userAddress.findMany({
      where: { userId },
      include: { address: true }
    });
    const addressesList = rows.map(r => r.address);
    return res.json({ success: true, addresses: addressesList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addAddressHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false });

    const { address_line1, address_line2, city, region, postal_code, countryId } = req.body;
    if (!address_line1 || !city) return res.status(400).json({ success: false, message: "address_line1 and city required" });

    const created = await prisma.address.create({
      data: {
        address_line1,
        address_line2: address_line2 ?? null,
        city,
        region,
        postal_code: Number(postal_code || 0),
        countryId: countryId ? Number(countryId) : 1 // fallback
      }
    });

    await prisma.userAddress.create({ data: { user: { connect: { id: userId } }, address: { connect: { id: created.id } } } });

    return res.json({ success: true, address: created });
  } catch (err) {
    console.error("addAddressHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function removeAddressHandler(req, res) {
  try {
    const userId = req.user?.id;
    const id = Number(req.params.id);
    if (!userId) return res.status(401).json({ success: false });
    if (!id) return res.status(400).json({ success: false, message: "id required" });

    // ensure relation exists
    const ua = await prisma.userAddress.findFirst({ where: { userId, addressId: id } });
    if (!ua) return res.status(404).json({ success: false, message: "Not found" });

    await prisma.userAddress.delete({ where: { id: ua.id } });
    await prisma.address.delete({ where: { id } });

    return res.json({ success: true });
  } catch (err) {
    console.error("removeAddressHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
