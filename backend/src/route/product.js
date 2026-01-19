import express from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireSeller } from './authHelpers.js';


const router = express.Router();

router.post('/', authMiddleware, requireSeller, async (req, res) => {
try {
const { title, description, price, stock } = req.body;
const sellerId = req.user.id;
const product = await prisma.product.create({ data: { title, description, price: Number(price), stock: Number(stock), sellerId } });
res.json({ product });
} catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.get('/my', authMiddleware, requireSeller, async (req, res) => {
try {
const sellerId = req.user.id;
const products = await prisma.product.findMany({ where: { sellerId } });
res.json({ products });
} catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});


router.get('/', async (req, res) => {
try {
const products = await prisma.product.findMany({ include: { seller: { select: { id: true, name: true } } } });

const data = products.map(p => ({ ...p, sellerName: p.seller.name }));
res.json({ products: data });
} catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', authMiddleware, requireSeller, async (req, res) => {
try {
const productId = Number(req.params.id);
const sellerId = req.user.id;
const existing = await prisma.product.findUnique({ where: { id: productId } });
if (!existing || existing.sellerId !== sellerId) return res.status(404).json({ message: 'Product not found or not yours' });
const { title, description, price, stock } = req.body;
const updated = await prisma.product.update({ where: { id: productId }, data: { title, description, price: Number(price), stock: Number(stock) } });
res.json({ product: updated });
} catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', authMiddleware, requireSeller, async (req, res) => {
try {
const productId = Number(req.params.id);
const sellerId = req.user.id;
const existing = await prisma.product.findUnique({ where: { id: productId } });
if (!existing || existing.sellerId !== sellerId) return res.status(404).json({ message: 'Product not found or not yours' });
await prisma.product.delete({ where: { id: productId } });
res.json({ message: 'Deleted' });
} catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});


export default router;