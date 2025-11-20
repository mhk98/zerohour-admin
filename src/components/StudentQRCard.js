import React from "react";
import { FaRegCopy, FaPrint } from "react-icons/fa";

const StudentQRCard = () => {
  const qrLink = "https://yourdomain.com/student-registration";

  const handleCopy = () => {
    navigator.clipboard.writeText(qrLink);
    alert("Link copied to clipboard!");
  };

  const handlePrint = () => {
    const printWindow = window.open();
    printWindow.document.write(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink)}" />`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-0 mt-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
          Student Registration
        </h2>

        <div className="flex justify-center mb-6">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink)}`}
            alt="QR Code"
            className="w-40 h-40 sm:w-48 sm:h-48"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCopy}
            className="flex-1 border border-brandRed text-brandRed hover:bg-brandRed-50 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <span>Copy Link</span>
            <FaRegCopy />
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-brandRed text-white hover:bg-brandRed-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <span>Print QR</span>
            <FaPrint />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQRCard;
