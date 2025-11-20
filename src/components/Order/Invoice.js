// import React, { useRef } from "react";
// import html2pdf from "html2pdf.js";

// const Invoice = ({ invoiceData }) => {
//   const invoiceRef = useRef();

//   const downloadInvoice = () => {
//     const opt = {
//       margin: 0.5,
//       filename: `invoice-${invoiceData.invoiceNo}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
//     };

//     const clone = invoiceRef.current.cloneNode(true);
//     clone.style.display = "block";
//     document.body.appendChild(clone);

//     html2pdf()
//       .set(opt)
//       .from(clone)
//       .save()
//       .then(() => {
//         document.body.removeChild(clone);
//       });
//   };

//   return (
//     <>
//       <button
//         onClick={downloadInvoice}
//         className="px-3 py-1 bg-red-600 text-white text-sm rounded"
//       >
//         Download Invoice
//       </button>

//       <div ref={invoiceRef} className="hidden">
//         <div className="p-8 max-w-3xl mx-auto bg-white text-black border rounded shadow">
//           {/* Header */}
//           <div className="flex justify-between items-center border-b pb-4 mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-red-600">
//                 Khatishodai.com
//               </h1>
//               <p className="text-gray-600 text-sm">
//                 +880 1643363229 | support@khatishodai.com
//               </p>
//               <p className="text-gray-600 text-sm">www.khatishodai.com</p>
//             </div>
//             <div className="text-right">
//               <h1 className="text-3xl font-bold">INVOICE</h1>
//               <p className="text-sm">Invoice #: {invoiceData.invoiceNo}</p>
//               <p className="text-sm">Date: {invoiceData.date}</p>
//               <p className="text-sm">Due Date: {invoiceData.dueDate}</p>
//             </div>
//           </div>

//           {/* Invoice To */}
//           <div className="mb-6">
//             <h2 className="font-semibold text-lg">Invoice To:</h2>
//             <p>Name: {invoiceData.name}</p>
//             <p>Address: {invoiceData.address}</p>
//             <p>Phone: {invoiceData.phone}</p>
//           </div>

//           {/* Items Table */}
//           <table className="w-full border-collapse text-sm mb-6">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2">SL</th>
//                 <th className="border p-2">Description</th>
//                 <th className="border p-2">Qty</th>
//                 <th className="border p-2">Sub-total</th>
//                 <th className="border p-2">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {invoiceData.items.map((item, index) => (
//                 <tr key={index} className="text-center">
//                   <td className="border p-2">{index + 1}</td>
//                   <td className="border p-2">{item.description}</td>
//                   <td className="border p-2">{item.qty}</td>
//                   <td className="border p-2">{item.subTotal}</td>
//                   <td className="border p-2">{item.total}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Totals */}
//           <div className="flex justify-end mb-6">
//             <div className="w-1/3">
//               <div className="flex justify-between border-b py-1">
//                 <span>Sub-total</span>
//                 <span>{invoiceData.subTotal}</span>
//               </div>
//               <div className="flex justify-between border-b py-1">
//                 <span>Delivery & Packaging</span>
//                 <span>{invoiceData.delivery}</span>
//               </div>
//               <div className="flex justify-between font-bold py-2 text-lg">
//                 <span>Total</span>
//                 <span>{invoiceData.total}</span>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="border-t pt-4 text-center">
//             <p className="text-gray-600 text-sm">Payment Info</p>
//             <p className="font-semibold text-sm">
//               Thank you for your business!
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Invoice;

import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import logo from "../../images/logo-ks.png";

const Invoice = ({ invoiceData }) => {
  const invoiceRef = useRef();

  const downloadInvoice = () => {
    const opt = {
      margin: 0.5,
      filename: `invoice-${invoiceData.invoiceNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    const clone = invoiceRef.current.cloneNode(true);
    clone.style.display = "block";
    document.body.appendChild(clone);

    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .then(() => {
        document.body.removeChild(clone);
      });
  };

  return (
    <>
      <button
        onClick={downloadInvoice}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded"
      >
        Download Invoice
      </button>

      <div ref={invoiceRef} className="hidden">
        <div className="p-8 max-w-3xl mx-auto bg-white text-black border rounded shadow text-sm">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <div>
              {/* <h1 className="text-2xl font-bold text-red-600">http://localhost:5000/
                Khatishodai.com
              </h1> */}
              <img src={logo} alt="Logo" width={300} height={100} />

              <p className="text-gray-700">+880 1643363229</p>
              <p className="text-gray-700">support@khatishodai.com</p>
              <p className="text-gray-700">www.khatishodai.com</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p>Invoice #: {invoiceData.invoiceNo}</p>
              <p>OrderId #: {invoiceData.OrderId}</p>
              <p>Date: {invoiceData.date}</p>
              {/* <p>Due Date: {invoiceData.dueDate}</p> */}
            </div>
          </div>

          {/* Invoice To */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg">Invoice To</h2>
            <p>Name: {invoiceData.name}</p>
            <p>Address: {invoiceData.address}</p>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border p-2">SL</th>
                <th className="border p-2">Decription</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Sub-Total</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.description}</td>
                  <td className="border p-2">{item.qty}</td>
                  <td className="border p-2">{item.subTotal} TK</td>
                  <td className="border p-2">{item.total} TK</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-1/3 text-sm">
              <div className="flex justify-between border-b py-1">
                <span>Sub-total</span>
                <span>{invoiceData.subTotal} TK</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span>Delivery & Packaging</span>
                <span>{invoiceData.delivery} TK</span>
              </div>
              <div className="flex justify-between font-bold py-2 text-base">
                <span>TOTAL</span>
                <span>{invoiceData.total} TK</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center">
            <p className="text-gray-700">Payment Info</p>
            <p className="font-semibold">Thank You For Your Business</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
