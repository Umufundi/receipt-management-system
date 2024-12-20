const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const Receipt = require('./models/Receipt');

// Load environment variables
dotenv.config();

// MongoDB connection with retry logic
const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose.connect(process.env.MONGODB_URI, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
    retryWrites: true,
    w: 'majority',
    retryReads: true,
    maxPoolSize: 10,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    // Send a ping to confirm a successful connection
    await mongoose.connection.db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Reconnecting...');
  setTimeout(connectWithRetry, 5000);
});

const app = express();

// Middleware
app.use(cors({
  origin: ['https://umufundi.github.io', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
require('fs').mkdirSync(uploadsDir, { recursive: true });

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'), false);
  }
};

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const dir = path.join(uploadsDir, year.toString(), month);
    
    // Create directory if it doesn't exist
    require('fs').mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: 'File upload error.' });
  }
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Routes
app.post('/api/receipts', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    console.log('Received file:', req.file.filename);
    console.log('Form data:', req.body);

    // Create receipt record in database
    const receipt = new Receipt({
      filePath: req.file.path,
      fileName: req.file.filename,
      employeeName: req.body.employeeName,
      department: req.body.department,
      purchaseDate: req.body.purchaseDate,
      vendor: req.body.vendor,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      category: req.body.category,
      projectCode: req.body.projectCode,
      description: req.body.description,
      uploadDate: new Date()
    });

    await receipt.save();
    console.log('Receipt saved to database:', receipt._id);
    
    // Generate the file URL
    const fileUrl = `${process.env.BACKEND_URL || `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`}/uploads/${year}/${month}/${req.file.filename}`;
    
    res.status(200).json({ 
      message: 'Receipt uploaded successfully', 
      receipt: {
        ...receipt.toObject(),
        fileUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload receipt' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    uploadsDir: uploadsDir
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadsDir}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 