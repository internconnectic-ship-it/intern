// src/pages/EvaluationPage.js
import React from 'react';
import axios from 'axios'; 
import { useParams } from 'react-router-dom';
import EvaluationCompanyForm from './EvaluationCompanyForm';
import EvaluationSupervisorForm from './EvaluationSupervisorForm';

const EvaluationPage = () => {
  const { id } = useParams(); // student_id
  const role = localStorage.getItem('role'); // 👉 ใช้ role จาก localStorage

  if (role === 'company') {
    return <EvaluationCompanyForm />;
  } else if (role === 'supervisor') {
    return <EvaluationSupervisorForm />;
  } else {
    return <div className="p-4 text-red-600">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;
  }
};

export default EvaluationPage;
