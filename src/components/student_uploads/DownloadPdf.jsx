// components/DownloadPortfolio.js
import React from "react";
import api from "../../services/api";

const DownloadPortfolio = ({ studentid }) => {
  const handleDownload = async () => {
    try {
      const response = await api.get(
        `student/${studentid}/portfolio-pdf`,
        {
          responseType: "blob", // important for binary files
        }
      );

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from headers OR fallback
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "Portfolio.pdf";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match.length > 1) fileName = match[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF", error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
    >
      Download Portfolio PDF
    </button>
  );
};

export default DownloadPortfolio;
