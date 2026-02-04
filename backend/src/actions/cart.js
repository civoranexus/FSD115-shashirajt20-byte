// // backend/src/route/cart.js
// import express from "express";
// import prisma from "../lib/prisma.js";
// import { verifyToken } from "../utils/token.js"; // adjust path if needed

// const router = express.Router();

// // GET / => get cart for current user (creates empty cart if not exists)
// router.get("/", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     let cart = await prisma.cart.findUnique({
//       where: { userId },
//       include: {
//         cartItems: {
//           include: {
//             productItem: {
//               include: {
//                 product: true,
//                 user: { select: { id: true, name: true, avatar: true } },
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!cart) {
//       cart = await prisma.cart.create({ data: { user: { connect: { id: userId } } }, include: { cartItems: true } });
//     }

//     return res.json({ success: true, cart });
//   } catch (err) {
//     console.error("getCartHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // POST /add => add productItem to cart
// router.post("/add", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const { productItemId, quantity } = req.body;
//     const qty = Number(quantity || 1);
//     if (!productItemId || qty <= 0) return res.status(400).json({ success: false, message: "productItemId and valid quantity required" });

//     const pitem = await prisma.productItem.findUnique({ where: { id: Number(productItemId) } });
//     if (!pitem) return res.status(404).json({ success: false, message: "Product item not found" });
//     if (pitem.status !== "ACTIVE") return res.status(400).json({ success: false, message: "Product item is not available" });
//     if (pitem.quantity_instock < qty) return res.status(400).json({ success: false, message: "Insufficient stock" });

//     let cart = await prisma.cart.findUnique({ where: { userId } });
//     if (!cart) {
//       cart = await prisma.cart.create({ data: { user: { connect: { id: userId } } } });
//     }

//     const existing = await prisma.cartItem.findFirst({
//       where: { cartId: cart.id, product_itemId: Number(productItemId) },
//     });

//     if (existing) {
//       const newQty = existing.quantity + qty;
//       if (newQty > pitem.quantity_instock) return res.status(400).json({ success: false, message: "Insufficient stock for requested quantity" });

//       const updated = await prisma.cartItem.update({
//         where: { id: existing.id },
//         data: { quantity: newQty },
//       });
//       return res.json({ success: true, action: "updated", item: updated });
//     } else {
//       const created = await prisma.cartItem.create({
//         data: {
//           cart: { connect: { id: cart.id } },
//           productItem: { connect: { id: Number(productItemId) } },
//           quantity: qty,
//         },
//       });
//       return res.json({ success: true, action: "created", item: created });
//     }
//   } catch (err) {
//     console.error("addToCartHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // POST /item/:id => update quantity for cart item (or delete when qty === 0)
// router.post("/item/:id", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const itemId = Number(req.params.id);
//     const { quantity } = req.body;
//     if (!itemId || quantity == null) return res.status(400).json({ success: false, message: "item id and quantity required" });
//     const qty = Number(quantity);
//     if (Number.isNaN(qty) || qty < 0) return res.status(400).json({ success: false, message: "Invalid quantity" });

//     const cartItem = await prisma.cartItem.findUnique({
//       where: { id: itemId },
//       include: { cart: true, productItem: true },
//     });
//     if (!cartItem) return res.status(404).json({ success: false, message: "Cart item not found" });
//     if (cartItem.cart.userId !== userId) return res.status(403).json({ success: false, message: "Forbidden" });

//     if (qty === 0) {
//       await prisma.cartItem.delete({ where: { id: itemId } });
//       return res.json({ success: true, action: "deleted" });
//     }

//     const pitem = await prisma.productItem.findUnique({ where: { id: cartItem.product_itemId } });
//     if (!pitem) return res.status(404).json({ success: false, message: "Product item not found" });
//     if (qty > pitem.quantity_instock) return res.status(400).json({ success: false, message: "Insufficient stock" });

//     const updated = await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: qty } });
//     return res.json({ success: true, item: updated });
//   } catch (err) {
//     console.error("updateCartItemHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // DELETE /item/:id => remove cart item
// router.delete("/item/:id", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const itemId = Number(req.params.id);
//     if (!itemId) return res.status(400).json({ success: false, message: "item id required" });

//     const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
//     if (!cartItem) return res.status(404).json({ success: false, message: "Cart item not found" });
//     if (cartItem.cart.userId !== userId) return res.status(403).json({ success: false, message: "Forbidden" });

//     await prisma.cartItem.delete({ where: { id: itemId } });
//     return res.json({ success: true });
//   } catch (err) {
//     console.error("removeCartItemHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// // POST /clear => clear current user's cart
// router.post("/clear", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const cart = await prisma.cart.findUnique({ where: { userId } });
//     if (!cart) return res.json({ success: true, message: "Cart already empty" });

//     await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
//     return res.json({ success: true });
//   } catch (err) {
//     console.error("clearCartHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

// export default router;
