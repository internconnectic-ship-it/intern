// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ✅ import routes
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

const app = express();

// ✅ กำหนด origin ที่อนุญาต
const allowedOrigins = [
  "http://localhost:3000",                // dev
  "https://intern-connect160.netlify.app" // production
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
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

// ✅ เส้นทางไฟล์ static (สำหรับรูป/ไฟล์ upload)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📌 log เวลา mount route change-password
console.log("📌 changePasswordRoutes ถูกโหลดเรียบร้อย");
app.use('/api/change-password', changePasswordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
