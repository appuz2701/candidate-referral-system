
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ts = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${ts}_${safeName}`);
  }
});

function fileFilter(req, file, cb) {
  const allowedMime = ['application/pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMime.includes(file.mimetype) || ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed as resume'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;
