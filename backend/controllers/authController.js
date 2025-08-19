const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res) => {
  const { id, name, email, password, role } = req.body;

  if (!id || !name || !email || !password || !role) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const [existingEmail] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({ message: 'อีเมลนี้มีผู้ใช้งานแล้ว' });
    }

    const [existingId] = await db.promise().query("SELECT * FROM users WHERE id = ?", [id]);
    if (existingId.length > 0) {
      return res.status(409).json({ message: 'รหัสผู้ใช้งานนี้ถูกใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกผู้ใช้งานในตาราง users และตั้ง approval_status เป็น 'pending' สำหรับ Company
    await db.promise().query(
      "INSERT INTO users (id, name, email, password, role, approval_status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [id, name, email, hashedPassword, role]
    );

    // สำหรับ role 'student'
    if (role === 'student') {
      await db.promise().query(
        `INSERT INTO student (
          student_id, student_name, email, phone_number, major, faculty, university, gender,
          year_level, gpa, birth_date, age, special_skills, profile_image
        ) VALUES (?, ?, ?, '', '', '', '', '', 1, 0, CURDATE(), 0, '', '')`,
        [id, name, email]
      );
    } 
    // สำหรับ role 'company'
    else if (role === 'company') {
      await db.promise().query(
        `INSERT INTO company (
          company_id, company_name, contact_email, contact_name,
          phone_number, business_type, address, created_date
        ) VALUES (?, ?, ?, '', '', '', '', CURDATE())`,

        [id, name, email]
      );
    }

    // สำหรับ role อื่นๆ เช่น instructor, supervisor, admin
    else if (role === 'instructor') {
      await db.promise().query(
        `INSERT INTO instructor (
          Instructor_id, Instructor_name, email
        ) VALUES (?, ?, ?)`,

        [id, name, email]
      );
    } else if (role === 'supervisor') {
      await db.promise().query(
        `INSERT INTO supervisor (
          supervisor_id, supervisor_name, email
        ) VALUES (?, ?, ?)`,

        [id, name, email]
      );
    } else if (role === 'admin') {
      await db.promise().query(
        `INSERT INTO admin (
          admin_id, admin_name, email, role, phone_number, profile_image
        ) VALUES (?, ?, ?, 'admin', '', '')`,

        [id, name, email]
      );
    }

    res.status(201).json({ message: '✅ สมัครสมาชิกสำเร็จ โปรดรอการอนุมัติจาก Admin' });

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดระหว่างการสมัคร:', error.sqlMessage || error.message);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
  }

  try {
    const [userRows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (userRows.length === 0) {
      return res.status(401).json({ message: 'ไม่พบผู้ใช้งาน' });
    }

    const user = userRows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const role = user.role;

    // ตรวจสอบสถานะการอนุมัติสำหรับ Company
    if (role === 'company' && user.approval_status !== 'approved') {
      return res.status(403).json({ message: 'บัญชีของคุณยังรอการอนุมัติจาก Admin' });
    }

    const token = jwt.sign({ id: user.id, role }, 'secretkey', { expiresIn: '1d' });

    res.status(200).json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      role,
      id: user.id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};

// ฟังก์ชัน resetPassword และ forgotPassword ยังคงเหมือนเดิม

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [user] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await db.promise().query(
      "INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)",
      [email, token, expires]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'รีเซ็ตรหัสผ่าน InternConnect',
      html: `<p>คลิกที่ลิงก์เพื่อตั้งรหัสผ่านใหม่:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: 'ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว' });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ต:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดำเนินการ' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM password_reset_tokens WHERE token = ?", [token]
    );

    if (rows.length === 0 || new Date(rows[0].expires_at) < new Date()) {
      return res.status(400).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.promise().query(
      "UPDATE users SET password = ? WHERE email = ?", [hashed, rows[0].email]
    );

    await db.promise().query(
      "DELETE FROM password_reset_tokens WHERE email = ?", [rows[0].email]
    );

    res.json({ message: 'ตั้งรหัสผ่านใหม่สำเร็จ' });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในระบบ' });
  }
};
