import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../../axios";  // ใช้ instance เดียวกัน
import Header from '../../components/Header';
import EvaluationCard from '../../components/EvaluationCard';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DashboardInstructorScores = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`${API_URL}/api/evaluation/all`)
        console.log("📌 ข้อมูลจาก backend:", res.data);
        const rows = Array.isArray(res.data) ? res.data : [];
        setStudents(rows.filter(r => r && typeof r === 'object'));
      } catch (err) {
        console.error('❌ โหลดข้อมูลล้มเหลว:', err);
        setStudents([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#9AE5F2] font-sans">
      <Header />
      <div className="px-[5%] py-[2%]">
        <h2 className="text-2xl font-extrabold text-[#130347] mb-6">
        ผลการประเมินนิสิต
        </h2>

        {students.length === 0 ? (
          <p className="text-[#465d71] text-center">ไม่มีข้อมูลการประเมิน</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((stu, idx) => (
              <EvaluationCard
                key={stu?.evaluation_id ?? stu?.student_id ?? idx}
                student={stu}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInstructorScores;
