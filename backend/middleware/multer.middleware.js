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

// File filter to accept only PDFs for resumes and images for photo
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'resume' && file.mimetype === 'application/pdf') {
        cb(null, true);
    } else if (file.fieldname === 'photo' && (file.mimetype.startsWith('image/'))) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type!'), false);
    }
};

// Image file filter for posts
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});
const jobFileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'job-files');
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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'job-file-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for job files (PDF, DOC, DOCX, images)
const jobFileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'text/plain'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type! Only PDF, DOC, DOCX, TXT and images are allowed.'), false);
    }
};

const uploadJobFiles = multer({
    storage: jobFileStorage,
    fileFilter: jobFileFilter,
    limits: { fileSize: 1024 * 1024 * 10 } // 10MB file size limit
});

// Image upload for posts
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: imageFilter
}).single('image');

module.exports = {
    upload,
    uploadJobFiles,
    uploadImage,
};