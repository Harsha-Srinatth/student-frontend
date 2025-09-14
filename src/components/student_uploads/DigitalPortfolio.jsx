import React from "react";
import DownloadPortfolio from "./DownloadPdf";

const StudentDigitalPortfolio = () => {
  const studentid = "24B91A5712"; // test with your DB studentid

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Student Dashboard</h1>
      <DownloadPortfolio studentid={studentid} />
    </div>
  );
};

export default StudentDigitalPortfolio;
