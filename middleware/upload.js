// middleware/upload.js
import multer from "multer";
import fs from "fs";
import path from "path";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// resumes storage
const resumesDir = path.join(process.cwd(), "uploads", "resumes");
ensureDir(resumesDir);

const storageResumes = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const fileFilterPdf = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF allowed"), false);
};

export const uploadResume = multer({ storage: storageResumes, fileFilter: fileFilterPdf });

// generic docs (for leaves) - accept pdf and images
const docsDir = path.join(process.cwd(), "uploads", "docs");
ensureDir(docsDir);

const storageDocs = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, docsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const docsFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/png", "image/jpeg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF/PNG/JPEG allowed"), false);
};

export const uploadDoc = multer({ storage: storageDocs, fileFilter: docsFilter });
