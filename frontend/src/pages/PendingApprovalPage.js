import React from 'react';

const PendingApprovalPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-700">
      <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700">บัญชีของคุณกำลังรอการอนุมัติจาก Admin</h1>
        <p className="text-lg mt-4 text-gray-700">
          กรุณารอการอนุมัติจาก Admin ก่อนที่คุณจะสามารถใช้งานระบบได้
        </p>
        <p className="mt-6 text-sm text-gray-500">
          หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติม กรุณาติดต่อผู้ดูแลระบบ
        </p>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
