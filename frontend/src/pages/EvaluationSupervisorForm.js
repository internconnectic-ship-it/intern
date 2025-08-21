// src/pages/EvaluationSupervisorForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const EvaluationSupervisorForm = () => {
  const { id } = useParams(); // student_id
  const supervisorId = localStorage.getItem('supervisorId');
  const instructorId = localStorage.getItem('instructorId');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [score, setScore] = useState({
    quality: '',
    behavior: '',
    skill: '',
    personality: '',
    content: '',
    qna: '',
    comment: ''
  });

  const maxScores = {
    quality: 20,
    behavior: 20,
    skill: 10,
    personality: 20,
    content: 20,
    qna: 10
  };

  // ✅ โหลดข้อมูลเก่า
  useEffect(() => {
    axios.get(`${API_URL}/api/evaluation/${id}?role=supervisor`)
      .then(res => {
        const data = res.data;
        if (data) {
          setScore({
            quality: data.score_quality || '',
            behavior: data.score_behavior || '',
            skill: data.score_skill || '',
            personality: data.score_presentation || '',
            content: data.score_content || '',
            qna: data.score_answer || '',
            comment: data.comment || data.supervisor_comment || ''
          });
        }
      })
      .catch(err => console.error('❌ โหลดคะแนนเก่าไม่สำเร็จ:', err));
  }, [id, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'comment') {
      setScore({ ...score, [name]: value });
      return;
    }
    if (value === '') {
      setScore({ ...score, [name]: '' });
      return;
    }
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maxScores[name]) {
      setScore({ ...score, [name]: numericValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ ตรวจสอบก่อนส่ง
    for (const key in maxScores) {
      const val = parseInt(score[key]);
      if (isNaN(val) || val > maxScores[key]) {
        alert(`❌ ค่าคะแนน '${key}' ต้องไม่เกิน ${maxScores[key]} คะแนน`);
        return;
      }
    }

    try {
      await axios.post(`${API_URL}/api/evaluation/submit`, {
        student_id: id,
        role: 'supervisor',
        score_quality: score.quality,
        score_behavior: score.behavior,
        score_skill: score.skill,
        score_presentation: score.personality,
        score_content: score.content,
        score_answer: score.qna,
        supervisor_comment: score.comment,
        evaluation_date: new Date().toISOString().split('T')[0],
        supervisor_id: supervisorId,
        instructor_id: instructorId
      });

      alert('✅ ส่งผลการประเมินเรียบร้อยแล้ว');
      navigate('/supervisor/evaluation');
    } catch (err) {
      console.error('❌ เกิดข้อผิดพลาด:', err);
      alert('❌ ส่งผลล้มเหลว');
    }
  };

  return (
    <div className="min-h-screen bg-[#9AE5F2] font-sans">
      <Header />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 mt-4">
        <div className="bg-white text-[#130347] p-6 rounded-2xl shadow-lg w-full max-w-6xl border border-[#E6F0FF] mx-auto">

          <h2 className="text-2xl font-extrabold text-left text-[#130347] mb-4">
            แบบประเมินนิสิตโดยอาจารย์นิเทศ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <SectionTitle>📘 ตารางที่ 1: นิเทศงาน</SectionTitle>

            <FormGroup title="1. คุณภาพงาน (20 คะแนน)" name="quality" value={score.quality} onChange={handleChange}
              items={["1.1 งานตรงกับสาขา", "1.2 คุณลักษณะงาน (Job description)"]} />

            <FormGroup title="2. พฤติกรรม (20 คะแนน)" name="behavior" value={score.behavior} onChange={handleChange}
              items={["2.1 การแต่งกาย", "2.2 การมีส่วนร่วม", "2.3 ทำงานร่วมกับผู้อื่น", "2.4 ความคิดสร้างสรรค์", "2.5 กล้าแสดงความคิดเห็น", "2.6 รับผิดชอบงานตามเวลา"]} />

            <FormGroup title="3. ทักษะ (10 คะแนน)" name="skill" value={score.skill} onChange={handleChange}
              items={["3.1 แก้ปัญหาเฉพาะหน้า", "3.2 วางแผนปฏิบัติงาน"]} />

            <SectionTitle>📘 ตารางที่ 2: การนำเสนอผลงาน</SectionTitle>

            <FormGroup title="1. บุคลิกภาพ (20 คะแนน)" name="personality" value={score.personality} onChange={handleChange}
              items={["1.1 การแต่งกาย", "1.2 ความสามารถนำเสนอ", "1.3 การรักษาเวลา"]} />

            <FormGroup title="2. เนื้อหา (20 คะแนน)" name="content" value={score.content} onChange={handleChange}
              items={["2.1 เนื้อหาครอบคลุม", "2.2 รูปภาพประกอบ", "2.3 เทคนิคการนำเสนอ", "2.4 ความคิดสร้างสรรค์", "2.5 รายงานสมบูรณ์"]} />

            <FormGroup title="3. ตอบคำถาม (10 คะแนน)" name="qna" value={score.qna} onChange={handleChange}
              items={["3.1 ความสามารถในการตอบคำถาม"]} />

            <div>
              <label className="font-semibold text-[#130347] block mb-2">💬 ความคิดเห็นเพิ่มเติม</label>
              <textarea
                name="comment"
                value={score.comment}
                onChange={handleChange}
                className="border border-[#E6F0FF] rounded-lg w-full p-3 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                rows={3}
                placeholder="กรอกความคิดเห็นเพิ่มเติม..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 shadow-md"
              >
                ✅ ส่งแบบประเมิน
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-bold text-[#130347] bg-[#F8FBFF] border-l-4 border-indigo-500 pl-3 py-2 rounded">
    {children}
  </h3>
);

const FormGroup = ({ title, items, name, value, onChange }) => (
  <div className="bg-[#F8FBFF] p-4 rounded-lg border border-[#E6F0FF] mb-4 shadow-sm">
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <label className="font-semibold text-[#130347]">{title}</label>
        <ul className="text-sm text-[#465d71] pl-6 mt-1 space-y-1 list-none">
          {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="border border-[#8ab2ee] rounded-lg w-20 h-10 p-2 text-center focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        required
      />
    </div>
  </div>
);

export default EvaluationSupervisorForm;
