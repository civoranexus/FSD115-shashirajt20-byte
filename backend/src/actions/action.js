import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";

export async function signIn(req, res) {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }
        const token = generateToken({
            id: user.id
        })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // prod me true
            sameSite: "none"
        });
        return res.json({
            success: true,
            message: "Login success",
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message ?? "Server error"
        })
    }
}


export async function signUp(req, res) {
    try {
        const { name, email, phone_no, avatar, password } = req.body;

        if (!/^\d{10}$/.test(phone_no)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number (must be 10 digits)"
            });
        }

        // check if already exists
        const exist = await prisma.user.findUnique({ where: { email } });
        if (exist) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        const existPhoneNo = await prisma.user.findUnique({ where: { phone_no } });
        if (existPhoneNo) {
            return res.json({
                success: false,
                message: "Phone no. is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, phone_no, avatar, password: hashedPassword }
        });

        const token = generateToken({ id: user.id });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // prod me true
            sameSite: "none"
        });
        return res.json({
            success: true,
            message: "Signup successful"
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message ?? "Server error"
        })
    }
}


export async function logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true, // prod me true
            sameSite: "none"
        });

        return res.json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "Something went wrong"
        });
    }
}

// // 1) createCatalogProduct (admin-only)
// async function createCatalogProduct(req, res) {
//   const { title, description, price, categoryId, breedId, milk_capacityId, image } = req.body;

//   // simple admin check
//   if (!req.user || req.user.role !== 'ADMIN') {
//     return res.status(403).json({ success: false, message: 'Admin access required' });
//   }

//   if (!title || !description) {
//     return res.status(400).json({ success: false, message: 'title and description required' });
//   }

//   try {
//     const product = await prisma.product.create({
//       data: {
//         title,
//         description,
//         // pass Decimal as string if provided
//         price: price != null ? price.toString() : null,
//         categoryId: categoryId ? Number(categoryId) : null,
//         breedId: breedId ? Number(breedId) : null,
//         milk_capacityId: milk_capacityId ? Number(milk_capacityId) : null,
//         image: image ?? null
//       }
//     });

//     return res.json({ success: true, product });
//   } catch (err) {
//     console.error('createCatalogProduct error', err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }


// // 2) createOrUpdateProductItemHandler (seller-only) — avoids duplicate seller listings
// async function createOrUpdateProductItemHandler(req, res) {
//   const sellerId = req.user?.id;
//   const { productId, price, quantity_instock, image } = req.body;

//   if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
//   if (req.user.role !== 'SELLER') return res.status(403).json({ success: false, message: 'Seller role required' });

//   if (!productId) return res.status(400).json({ success: false, message: 'productId required' });
//   if (price == null && quantity_instock == null && image == null) {
//     return res.status(400).json({ success: false, message: 'At least one of price, quantity_instock or image is required' });
//   }

//   try {
//     // ensure referenced Product exists
//     const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
//     if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

//     // find existing listing by this seller for this product
//     const existing = await prisma.productItem.findFirst({
//       where: { productId: Number(productId), userId: sellerId }
//     });

//     if (existing) {
//       // update existing listing
//       const updated = await prisma.productItem.update({
//         where: { id: existing.id },
//         data: {
//           price: price != null ? price.toString() : undefined,
//           quantity_instock: quantity_instock != null ? Number(quantity_instock) : undefined,
//           image: image ?? undefined,
//           isActive: true // reactivate if needed
//         },
//         include: { product: true, user: true }
//       });
//       return res.json({ success: true, action: 'updated', productItem: updated });
//     } else {
//       // create new listing
//       const created = await prisma.productItem.create({
//         data: {
//           product: { connect: { id: Number(productId) } },
//           user: { connect: { id: sellerId } },
//           price: price != null ? price.toString() : '0.00',
//           quantity_instock: quantity_instock != null ? Number(quantity_instock) : 0,
//           image: image ?? null,
//           isActive: true
//         },
//         include: { product: true, user: true }
//       });
//       return res.json({ success: true, action: 'created', productItem: created });
//     }
//   } catch (err) {
//     console.error('createOrUpdateProductItemHandler error', err);
//     // If you added @@unique([productId, userId]) and a race condition happens,
//     // Prisma may throw a unique constraint error — handle that carefully in production.
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

// // 3) createCattleHandler (seller-only, check unique tag)
// async function createCattleHandler(req, res) {
//   const sellerId = req.user?.id;
//   const {
//     tag_id, title, description, breedId, milk_capacityId,
//     age_months, weight_kg, gender, health_status, image, price
//   } = req.body;

//   if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
//   if (req.user.role !== 'SELLER') return res.status(403).json({ success: false, message: 'Seller role required' });

//   if (!title || !price) return res.status(400).json({ success: false, message: 'title and price are required' });

//   try {
//     // if tag_id provided, ensure uniqueness
//     if (tag_id) {
//       const byTag = await prisma.cattle.findUnique({ where: { tag_id } }); // requires tag_id @unique in schema
//       if (byTag) return res.status(409).json({ success: false, message: 'tag_id already exists' });
//     }

//     const cattle = await prisma.cattle.create({
//       data: {
//         seller: { connect: { id: sellerId } },
//         tag_id: tag_id ?? null,
//         title,
//         description: description ?? null,
//         breedId: breedId ? Number(breedId) : null,
//         milk_capacityId: milk_capacityId ? Number(milk_capacityId) : null,
//         age_months: age_months ? Number(age_months) : null,
//         weight_kg: weight_kg ? Number(weight_kg) : null,
//         gender: gender ?? null,
//         health_status: health_status ?? null,
//         image: image ?? '',
//         price: price.toString(), // Decimal as string
//         status: 'ACTIVE'
//       }
//     });

//     return res.json({ success: true, cattle });
//   } catch (err) {
//     console.error('createCattleHandler error', err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

