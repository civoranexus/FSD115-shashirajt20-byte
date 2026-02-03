// import express from "express";
// import multer from "multer";

// const routers = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads");
//     },
//     filename: function (req, file, cb) {
//         const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, unique + "-" + file.originalname);
//     },
// });

// const upload = multer({ storage });

// routers.post("/uploads", upload.single("image"), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No file uploaded"
//             });
//         }

//         return res.json({
//             success: true,
//             url: `/uploads/${req.file.filename}`,
//         });
//     } catch (err) {
//         console.error("upload error", err);
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         });
//     }
// });

// export default routers;


// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import path from "path";

// const router = express.Router();
// const uploadDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const safeName = file.originalname.replace(/\s+/g, "-");
//     cb(null, unique + "-" + safeName);
//   },
// });

// function fileFilter(req, file, cb) {
//   if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only image files are allowed"), false);
// }

// const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// router.post("/uploads", upload.single("image"), (req, res) => {
//   try {
//     console.log("upload called, file:", req.file && { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size });
//     if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
//     return res.json({ success: true, url: `/uploads/${req.file.filename}` });
//   } catch (err) {
//     console.error("upload error", err);
//     return res.status(500).json({ success: false, message: err.message || "Upload failed" });
//   }
// });

// export default router;
