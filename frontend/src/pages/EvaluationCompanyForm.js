import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const EvaluationCompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');

  const [student, setStudent] = useState(null);
  const [scores, setScores] = useState({});
  const [companyComment, setCompanyComment] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/student/${id}`)
      .then(res => setStudent(res.data))
      .catch(err => console.error('❌ โหลดนิสิตล้มเหลว:', err));
  }, [id]);

  useEffect(() => {
    axios.get(`${API_URL}/api/evaluation/company-details/${id}`)
      .then(res => {
        const data = res.data;
        if (data) {
          setCompanyComment(data.company_comment || '');
          setScores({
            p1: data.p1, p2: data.p2, p3: data.p3, p4: data.p4, p5: data.p5,
            p6: data.p6, p7: data.p7, p8: data.p8, p9: data.p9, p10: data.p10,
            w1: data.w1, w2: data.w2, w3: data.w3, w4: data.w4, w5: data.w5,
            w6: data.w6, w7: data.w7, w8: data.w8, w9: data.w9, w10: data.w10,
            absent_sick: data.absent_sick,
            absent_personal: data.absent_personal,
            late_days: data.late_days,
            absent_uninformed: data.absent_uninformed,
            company_comment: data.company_comment || ''
          });
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          // ไม่พบข้อมูลเดิม ให้ใช้ค่า default
          setScores({});
          setCompanyComment('');
        } else {
          console.error('❌ โหลดคะแนน company details ไม่สำเร็จ:', err);
        }
      });
  }, [id]);

  const [form, setForm] = useState({
    absent_sick: 0,
    absent_personal: 0,
    late_days: 0,
    absent_uninformed: 0,
    company_comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseInt(value, 10)
    }));
  };


  const calcTotalScore = () => {
    let total = 0;
    for (let i = 1; i <= 10; i++) total += parseInt(scores[`p${i}`]) || 0;
    for (let i = 1; i <= 10; i++) total += parseInt(scores[`w${i}`]) || 0;
    const weights = [2, 2, 1, 4];
    let penalty = 0;
    for (let i = 0; i < 4; i++) {
      penalty += (parseInt(scores[`absent_days${i}`]) || 0) * weights[i];
    }
    total += Math.max(0, 20 - penalty);
    return total;
  };

  const handleSubmit = async () => {
    for (let i = 1; i <= 10; i++) {
      if (!scores[`p${i}`] || !scores[`w${i}`]) {
        alert(`❌ กรุณาให้คะแนนครบทุกช่องในหัวข้อ 1 และ 2`);
        return;
      }
    }
     console.log("📦 form to send =", form); 
    const totalScore = calcTotalScore();
    try {
      await axios.post(`${API_URL}/api/evaluation/submit`, {
        student_id: id,
        company_id: companyId,
        role: 'company',
        ...scores,
        ...form,
        company_comment: companyComment,
        evaluation_date: new Date().toISOString().split('T')[0]
      });
      alert("✅ ส่งแบบประเมินสำเร็จ");
      navigate('/company/evaluation');
    } catch (err) {
      console.error("❌ บันทึกล้มเหลว:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const renderSection = (title, prefix, items) => (
    <div className="mb-6">
      <h3 className="font-bold text-[#130347] mb-3">{title}</h3>
      <table className="w-full text-left border border-gray-300 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#6EC7E2] text-[#130347]">
            <th className="p-2 w-[50%]">หัวข้อ</th>
            {[5, 4, 3, 2, 1].map(score => (
              <th key={score} className="text-center">{score}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="p-2">{index + 1}. {item}</td>
              {[5, 4, 3, 2, 1].map(score => (
                <td key={score} className="text-center">
                  <input
                    type="radio"
                    name={`${prefix}${index + 1}`}
                    value={score}
                    checked={scores[`${prefix}${index + 1}`] === score}
                    onChange={handleChange}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#9AE5F2] text-[#130347] font-sans">
      <Header />
      <div className="flex justify-center p-4">
        <div className="bg-white text-black p-4 rounded-xl shadow-md w-[88%]">
          <h2 className="text-2xl font-extrabold mb-4">
            แบบประเมินนิสิตโดยสถานประกอบการ
          </h2>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            className="bg-white p-8 rounded-xl shadow-md"
          >
            {renderSection("1. ประเมินบุคลิกภาพ (คะแนนรวม 50 คะแนน)", 'p', [
              "แต่งกายสะอาดถูกต้องตามระเบียบของมหาวิทยาลัย", "มีกิริยามารยาทเรียบร้อย มีสัมมาคาราวะ", "มีมนุษยสัมพันธ์ที่ดีกับคนทั่วไป", "ควบคุมอารมณ์ ไม่ฉุนเฉียว อดทน ร่าเริง แจ่มใส", "มีความว่องไว กระฉับกระเฉง",
              "รับผิดชอบงานในหน้าที่และงานที่ได้รับมอบหมาย", "ร่วมงานกับเพื่อนร่วมงานได้ดี", "สนใจพบหัวหน้างานหรือผู้ควบคุมงาน", "มีคุณลักษณะของผู้นำและผู้ตามที่ดี", "มาทำงานตรงเวลา ไม่กลับก่อนเวลา"
            ])}

            {renderSection("2. ประเมินการปฏิบัติงาน (คะแนนรวม 50 คะแนน)", 'w', [
              "ทำบันทึกที่ได้รับมอบหมายอย่างสม่ำเสมอและเรียบร้อย", "เข้าใจจุดประสงค์ของงาน", "วางแผนการปฏิบัติงานล่วงหน้า", "จัดทำปฏิทินหรือกำหนดเวลางานชัดเจน",
              "เข้าใจขั้นตอนการปฏิบัติงาน", "ปฏิบัติงานเสร็จตามเวลาที่กำหนด", "บันทึกความก้าวหน้าการทำงานอย่างสม่ำเสมอ",
              "ผลงานเป็นไปตามจุดประสงค์ของงาน", "แก้ปัญหาเฉพาะหน้าได้", "ประเมินและปรับปรุงข้อบกพร่องของตนเองอยู่เสมอ"
            ])}

            <h3 className="font-bold text-[#130347] mt-6 mb-3">
              3. ประเมินเวลาในการปฏิบัติงาน (หักคะแนนจาก 20)
            </h3>
            {[
              { label: "ลาป่วย", name: "absent_sick", score: 2 },
              { label: "ลากิจ", name: "absent_personal", score: 2 },
              { label: "มาทำงานสาย", name: "late_days", score: 1 },
              { label: "ขาดงานโดยไม่ทราบสาเหตุ", name: "absent_uninformed", score: 4 }
            ].map((item, i) => (   // ✅ ต้องเป็น item
              <div key={i} className="mb-2 flex items-center">
                <label className="w-40">{item.label}:</label>
                <input
                  type="number"
                  name={item.name}                     // ✅ ถูกต้องแล้ว
                  value={form[item.name] || ""}
                  min={0}
                  step={1}
                  placeholder="วัน"
                  className="border p-1 w-20 rounded"
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-500">หักวันละ {item.score} คะแนน</span>
              </div>
            ))}
            <h3 className="font-bold text-[#130347] mt-6 mb-3">ความคิดเห็นเพิ่มเติม</h3>
            <textarea
              className="border p-2 w-full rounded"
              rows={4}
              value={companyComment}
              onChange={(e) => setCompanyComment(e.target.value)}
            />

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-[#225EC4] hover:bg-[#063D8C] text-white font-semibold py-2 px-4 rounded-full"
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

export default EvaluationCompanyForm;