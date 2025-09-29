const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure 'uploads/' exists
        const uploadDir = path.join(__dirname, '..', 'uploads');
        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        } catch (err) {
            cb(err);
        }
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to accept only PDFs for resumes and images for photos
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume' && file.mimetype === 'application/pdf') {
        cb(null, true);
    } else if (file.fieldname === 'photo' && (file.mimetype.startsWith('image/'))) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

module.exports = upload;