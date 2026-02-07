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

// export async function signUp(req, res) {
//     try {
//         const { name, email, phone_no, avatar, password } = req.body;

//         if (!/^\d{10}$/.test(phone_no)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid phone number (must be 10 digits)"
//             });
//         }

//         // check if already exists
//         const exist = await prisma.user.findUnique({ where: { email } });
//         if (exist) {
//             return res.json({
//                 success: false,
//                 message: "Email already registered"
//             });
//         }

//         const existPhoneNo = await prisma.user.findUnique({ where: { phone_no } });
//         if (existPhoneNo) {
//             return res.json({
//                 success: false,
//                 message: "Phone no. is already registered"
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await prisma.user.create({
//             data: { name, email, phone_no, avatar, password: hashedPassword }
//         });

//         const token = generateToken({ id: user.id });
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: true, // prod me true
//             sameSite: "none"
//         });
//         return res.json({
//             success: true,
//             message: "Signup successful"
//         });
//     } catch (error) {
//         return res.json({
//             success: false,
//             message: error.message ?? "Server error"
//         })
//     }
// }


export async function signUp(req, res) {
  try {
    const { name, email, phone_no, avatar, password, address, applySeller, seller_bio } = req.body;

    if (!/^\d{10}$/.test(phone_no)) {
      return res.status(400).json({ success: false, message: "Invalid phone number (must be 10 digits)" });
    }

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) return res.status(400).json({ success: false, message: "Email already registered" });

    const existPhoneNo = await prisma.user.findUnique({ where: { phone_no } });
    if (existPhoneNo) return res.status(400).json({ success: false, message: "Phone no. is already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // decide role: seller applicant or buyer by default
    const role = applySeller ? "SELLER" : "BUYER";

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone_no,
        avatar: avatar ?? "",
        password: hashedPassword,
        role,
        is_seller_verified: applySeller ? false : false,
        // if you added seller_bio field to User schema:
        ...(seller_bio ? { seller_bio } : {})
      }
    });

    // if address provided -> create address and link with userAddress
    if (address && (address.city || address.street || address.unit_no)) {
      const addr = await prisma.address.create({
        data: {
          unit_no: address.unit_no ?? null,
          address_line1: address.street ?? null,
          city: address.city ?? null,
          region: address.region ?? null,
          postal_code: address.postal_code ?? null,
          // set a default country id or require client to provide it; adjust as needed
          countryId: 1
        }
      });

      await prisma.userAddress.create({
        data: {
          user: { connect: { id: user.id } },
          address: { connect: { id: addr.id } }
        }
      });
    }

    const token = generateToken({ id: user.id });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // set true in prod
      sameSite: "none"
    });

    return res.json({ success: true, message: "Signup successful", userId: user.id });
  } catch (error) {
    console.error("signUp error", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
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

export async function createCatalogProduct(req, res) {
    const { title, description, price, categoryId, breedId, milk_capacityId, image } = req.body;
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }
    if (!title || !description || price == null || price === "" || !image) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({ success: false, message: "price must be a valid non-negative number" });
    }
    try {
        const product = await prisma.product.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                // price: price != null ? price.toString() : null,
                price: priceNum.toFixed(2),
                categoryId: categoryId ? Number(categoryId) : null,
                breedId: breedId ? Number(breedId) : null,
                milk_capacityId: milk_capacityId ? Number(milk_capacityId) : null,
                image: image ?? null
            }
        });
        return res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error("createCatalogProduct error", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function createUpdateProductItemHandler(req, res) {
    const sellerId = req.user?.id;
    const { productId, price, quantity_instock, image } = req.body;

    if (!sellerId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    if (req.user.role !== 'SELLER') {
        return res.status(403).json({
            success: false,
            message: 'Seller role required'
        });
    }
    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "productId required"
        });
    }
    if (price == null && quantity_instock == null && image == null) {
        return res.status(400).json({
            success: false,
            message: "At least one of price, quantity_instock or image is required"
        })
    }
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const existing = await prisma.productItem.findFirst({
            where: {
                productId: Number(productId),
                userId: sellerId
            }
        });
        if (existing) {
            const updated = await prisma.productItem.update({
                where: {
                    id: existing.id
                },
                data: {
                    price: price != null ? Number(price).toFixed(2) : undefined,
                    quantity_instock: quantity_instock != null ? Number(quantity_instock) : undefined,
                    image: image ?? undefined,
                    isActive: true,
                    status: "PENDING"
                },
                include: {
                    product: true,
                    user: true
                }
            });
            return res.json({
                success: true,
                action: "updated",
                productItem: updated
            });
        } else {
            const created = await prisma.productItem.create({
                data: {
                    product: { connect: { id: Number(productId) } },
                    user: { connect: { id: sellerId } },
                    price: price != null ? price.toString() : '0.00',
                    quantity_instock: quantity_instock != null ? Number(quantity_instock) : 0,
                    image: image ?? null,
                    isActive: true,
                    status: "PENDING"
                },
                include: { product: true, user: true }
            });
            return res.json({
                success: true,
                action: "created",
                productItem: created
            });
        }
    } catch (error) {
        console.error("createOrUpdateProductItemHandler error", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function createCattleHandler(req, res) {
    const sellerId = req.user?.id;
    const {
        tag_id, title, description, breedId, milk_capacityId,
        age_months, weight_kg, gender, health_status, image, price
    } = req.body;

    if (!sellerId)
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    if (req.user.role !== 'SELLER')
        return res.status(403).json({
            success: false,
            message: 'Seller role required'
        });

    if (!title || !price)
        return res.status(400).json({
            success: false,
            message: 'title and price are required'
        });

    try {
        if (tag_id) {
            const byTag = await prisma.cattle.findUnique({ where: { tag_id } }); // requires tag_id @unique in schema
            if (byTag)
                return res.status(409).json({
                    success: false,
                    message: 'tag_id already exists'
                });
        }

        const cattle = await prisma.cattle.create({
            data: {
                seller: { connect: { id: sellerId } },
                tag_id: tag_id ?? null,
                title,
                description: description ?? null,
                breedId: breedId ? Number(breedId) : null,
                milk_capacityId: milk_capacityId ? Number(milk_capacityId) : null,
                age_months: age_months ? Number(age_months) : null,
                weight_kg: weight_kg ? Number(weight_kg) : null,
                gender: gender ?? null,
                health_status: health_status ?? null,
                image: image ?? '',
                price: price.toString(),
                status: 'ACTIVE'
            }
        });

        return res.json({ success: true, cattle });
    } catch (err) {
        console.error('createCattleHandler error', err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export async function getCategories(req, res) {
    try {
        const rows = await prisma.category.findMany({
            orderBy: {
                category_name: "asc"
            },
        });
        return res.json(rows);
    } catch (error) {
        console.error("getCategories error", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getBreeds(req, res) {
    try {
        const rows = await prisma.breed.findMany({
            orderBy: {
                breed_name: "asc"
            },
        });
        return res.json(rows);
    } catch (err) {
        console.error("getBreeds error", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function getMilkcapacities(req, res) {
    try {
        const rows = await prisma.milkcapacity.findMany({
            orderBy: {
                capacity: "asc"
            },
        });
        return res.json(rows);
    } catch (err) {
        console.error("getMilkcapacities error", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function getProducts(req, res) {
    try {
        const rows = await prisma.product.findMany({
            orderBy: { title: "asc" },
            include: {
                category: true,
                breed: true,
                milkcapacity: true,
            },
        });
        return res.json(rows);
    } catch (err) {
        console.error("getProducts error", err);
        return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
}

export async function getSellerListings(req, res) {
    const sellerId = req.user?.id;

    if (!sellerId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    if (req.user.role !== "SELLER") {
        return res.status(403).json({
            success: false,
            message: "Seller role required",
        });
    }

    try {
        const listings = await prisma.productItem.findMany({
            where: { userId: sellerId },
            orderBy: { id: "desc" },
            include: {
                product: {
                    include: {
                        category: true,
                        breed: true,
                        milkcapacity: true,
                    },
                },
            },
        });

        return res.json({
            success: true,
            listings,
        });
    } catch (err) {
        console.error("getSellerListings error", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export async function getSellerListingByProductId(req, res) {
    const sellerId = req.user?.id;
    const { productId } = req.params;

    if (!sellerId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "SELLER") {
        return res.status(403).json({ success: false, message: "Seller role required" });
    }

    if (!productId) {
        return res.status(400).json({ success: false, message: "productId required" });
    }

    try {
        const listing = await prisma.productItem.findFirst({
            where: {
                userId: sellerId,
                productId: Number(productId),
            },
            include: {
                product: {
                    include: {
                        category: true,
                        breed: true,
                        milkcapacity: true,
                    },
                },
            },
        });

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        return res.json({
            success: true,
            listing,
        });
    } catch (err) {
        console.error("getSellerListingByProductId error", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

// ---- admin sellers handlers ----
export async function getPendingSellers(req, res) {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const pending = await prisma.user.findMany({
            where: {
                role: "SELLER",
                is_seller_verified: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone_no: true,
                avatar: true,
            },
        });

        return res.json({ success: true, sellers: pending });
    } catch (err) {
        console.error("getPendingSellers error", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export async function approveSellerHandler(req, res) {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        const sellerId = Number(req.params.id);
        if (!sellerId) {
            return res.status(400).json({
                success: false,
                message: "seller id required"
            });
        }

        const user = await prisma.user.findUnique({ where: { id: sellerId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "SELLER") {
            return res.status(400).json({
                success: false,
                message: "User is not a seller candidate"
            });
        }

        const updated = await prisma.user.update({
            where: {
                id: sellerId
            },
            data: {
                is_seller_verified: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                is_seller_verified: true
            }
        });

        return res.json({
            success: true,
            seller: updated
        });
    } catch (err) {
        console.error("approveSellerHandler error", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// ---- admin listings handlers ----
export async function getPendingListings(req, res) {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }

        const pending = await prisma.productItem.findMany({
            where: { status: "PENDING" },
            orderBy: { id: "desc" },
            include: {
                product: {
                    include: { category: true, breed: true, milkcapacity: true }
                },
                user: true
            }
        });

        return res.json({ success: true, listings: pending });
    } catch (err) {
        console.error("getPendingListings error", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export async function approveListingHandler(req, res) {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }

        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: "id required" });

        const updated = await prisma.productItem.update({
            where: { id },
            data: { status: "ACTIVE", reject_reason: null },
            include: { product: true, user: true }
        });

        return res.json({ success: true, listing: updated });
    } catch (err) {
        console.error("approveListingHandler error", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export async function rejectListingHandler(req, res) {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Admin access required" });
        }

        const id = Number(req.params.id);
        const { reason } = req.body;
        if (!id) return res.status(400).json({ success: false, message: "id required" });

        const updated = await prisma.productItem.update({
            where: { id },
            data: { status: "REJECTED", reject_reason: reason ?? null },
            include: { product: true, user: true }
        });

        return res.json({ success: true, listing: updated });
    } catch (err) {
        console.error("rejectListingHandler error", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export async function getActiveProductItems(req, res) {
    try {
        const rows = await prisma.productItem.findMany({
            where: { status: "ACTIVE" },
            orderBy: { id: "desc" },
            include: {
                product: { include: { category: true, breed: true, milkcapacity: true } },
                user: { select: { id: true, name: true, avatar: true } }
            }
        });
        return res.json({ success: true, items: rows });
    } catch (err) {
        console.error("getActiveProductItems error", err);
        return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
}

// get single product (frame) by id
export async function getProductById(req, res) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "id required" });

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                breed: true,
                milkcapacity: true
            }
        });

        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        return res.json({ success: true, product });
    } catch (err) {
        console.error("getProductById error", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

// get active productItems (listings) for a given product id
export async function getActiveProductItemsByProductId(req, res) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "product id required" });

    try {
        const items = await prisma.productItem.findMany({
            where: {
                productId: id,
                status: "ACTIVE"
            },
            orderBy: { id: "desc" },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                product: true
            }
        });

        return res.json({ success: true, items });
    } catch (err) {
        console.error("getActiveProductItemsByProductId error", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}


//


// export async function getCartHandler(req, res) {
//     try {
//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         let cart = await prisma.cart.findUnique({
//             where: { userId },
//             include: {
//                 cartItems: {
//                     include: {
//                         productItem: {
//                             include: {
//                                 product: true,
//                                 user: { select: { id: true, name: true, avatar: true } }
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         if (!cart) {
//             cart = await prisma.cart.create({
//                 data: {
//                     user: { connect: { id: userId } }
//                 },
//                 include: {
//                     cartItems: true
//                 }
//             });
//         }

//         return res.json({
//             success: true,
//             cart
//         });

//     } catch (error) {
//         console.error("getCartHandler error", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }
export async function getCartHandler(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 use findFirst instead of findUnique
    let cart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            productItem: {
              include: {
                product: true,
                user: {
                  select: { id: true, name: true, avatar: true },
                },
              },
            },
          },
        },
      },
    });

    // create empty cart if not exists
    if (!cart) {
      cart = await prisma.cart.create({
        data: { user: { connect: { id: userId } } },
        include: { cartItems: true },
      });
    }

    return res.json({ success: true, cart });

  } catch (err) {
    console.error("getCartHandler error", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}






// export async function addToCartHandler(req, res) {
//     try {
//         const userId = req.user?.id;
//         const { productItemId, quantity } = req.body;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized"
//             });
//         }

//         if (!productItemId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "productItemId required"
//             });
//         }

//         const qty = Number(quantity || 1);
//         if (Number.isNaN(qty) || qty <= 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "quantity must be a valid number"
//             });
//         }

//         const pItem = await prisma.productItem.findUnique({
//             where: { id: Number(productItemId) }
//         });

//         if (!pItem) {
//             return res.status(404).json({
//                 success: false,
//                 message: "ProductItem not found"
//             });
//         }

//         if (pItem.status !== "ACTIVE") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Product is not active"
//             });
//         }

//         if (pItem.quantity_instock < qty) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Insufficient stock"
//             });
//         }

//         let cart = await prisma.cart.findUnique({
//             where: { userId }
//         });

//         if (!cart) {
//             cart = await prisma.cart.create({
//                 data: {
//                     user: { connect: { id: userId } }
//                 }
//             });
//         }

//         const existing = await prisma.cartItem.findFirst({
//             where: {
//                 cartId: cart.id,
//                 product_itemId: Number(productItemId)
//             }
//         });

//         if (existing) {
//             const newQty = existing.quantity + qty;

//             if (newQty > pItem.quantity_instock) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Insufficient stock for requested quantity"
//                 });
//             }

//             const updated = await prisma.cartItem.update({
//                 where: { id: existing.id },
//                 data: { quantity: newQty }
//             });

//             return res.json({
//                 success: true,
//                 action: "updated",
//                 item: updated
//             });
//         }

//         const created = await prisma.cartItem.create({
//             data: {
//                 cart: { connect: { id: cart.id } },
//                 productItem: { connect: { id: Number(productItemId) } },
//                 quantity: qty
//             }
//         });

//         return res.json({
//             success: true,
//             action: "created",
//             item: created
//         });

//     } catch (error) {
//         console.error("addToCartHandler error", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

export async function addToCartHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { productItemId, quantity } = req.body;
    const qty = Number(quantity || 1);

    if (!productItemId || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "productItemId and valid quantity required",
      });
    }

    //  Check product item
    const productItem = await prisma.productItem.findUnique({
      where: { id: Number(productItemId) },
    });

    if (!productItem) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (productItem.status !== "ACTIVE") {
      return res.status(400).json({ success: false, message: "Product not active" });
    }

    if (productItem.quantity_instock < qty) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    //  Get or create cart (IMPORTANT FIX)
    let cart = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user: { connect: { id: userId } },
        },
      });
    }

    //  Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        product_itemId: Number(productItemId),
      },
    });

    if (existingItem) {
      const newQty = existingItem.quantity + qty;

      if (newQty > productItem.quantity_instock) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }

      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });

      return res.json({ success: true, action: "updated", item: updated });
    }

    // 4️⃣ Create new cart item
    const created = await prisma.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        productItem: { connect: { id: Number(productItemId) } },
        quantity: qty,
      },
    });

    return res.json({ success: true, action: "created", item: created });

  } catch (err) {
    console.error("addToCartHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}






export async function updateCartItemHandler(req, res) {
    try {
        const userId = req.user?.id;
        const itemId = Number(req.params.id);
        const { quantity } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "item id required"
            });
        }

        const qty = Number(quantity);
        if (Number.isNaN(qty) || qty < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity"
            });
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }

        if (qty === 0) {
            await prisma.cartItem.delete({ where: { id: itemId } });
            return res.json({ success: true, action: "deleted" });
        }

        const pItem = await prisma.productItem.findUnique({
            where: { id: cartItem.product_itemId }
        });

        if (!pItem) {
            return res.status(404).json({
                success: false,
                message: "ProductItem not found"
            });
        }

        if (qty > pItem.quantity_instock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        const updated = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: qty }
        });

        return res.json({
            success: true,
            item: updated
        });

    } catch (error) {
        console.error("updateCartItemHandler error", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function removeCartItemHandler(req, res) {
    try {
        const userId = req.user?.id;
        const itemId = Number(req.params.id);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!itemId) {
            return res.status(400).json({
                success: false,
                message: "item id required"
            });
        }

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { cart: true }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        if (cartItem.cart.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }

        await prisma.cartItem.delete({
            where: { id: itemId }
        });

        return res.json({
            success: true,
            message: "Item removed"
        });

    } catch (error) {
        console.error("removeCartItemHandler error", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function clearCartHandler(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const cart = await prisma.cart.findUnique({ where: { userId } });

        if (!cart) {
            return res.json({
                success: true,
                message: "Cart already empty"
            });
        }

        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        return res.json({
            success: true,
            message: "Cart cleared"
        });

    } catch (error) {
        console.error("clearCartHandler error", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}