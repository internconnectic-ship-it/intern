// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ ต้องมี
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes'); 
const internshipRoutes = require('./routes/internshipRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const changePasswordRoutes = require('./routes/changePasswordRoutes');
const allowedOrigins = [
  "http://localhost:3000",                 // เวลา dev
  "https://intern-connect160.netlify.app"  // domain ของ Netlify จริง
];
require('dotenv').config();

const app = express();
//app.use(cors());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ✅ กำหนดเส้นทาง API
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/instructor', instructorRoutes); 
app.use('/api/supervisor', supervisorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/job_posting', jobPostRoutes); 
app.use('/api/internship', internshipRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/reports', reportRoutes);
app.options("*", cors());
app.use((req, res, next) => {
  console.log("🌐 Request from:", req.headers.origin, req.method, req.path);
  next();
});

// ✅ เส้นทางไฟล์ static (สำหรับรูป/ไฟล์ upload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📌 log เวลา mount route change-password
console.log("📌 changePasswordRoutes ถูกโหลดเรียบร้อย");
app.use('/api/change-password', changePasswordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
