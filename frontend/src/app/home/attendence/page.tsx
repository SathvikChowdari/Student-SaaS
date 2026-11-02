"use client";
import React, { useState ,useEffect } from "react";
import Calendar1 from "./calender";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

function AttendencePage() {
  const [checkedRows, setCheckedRows] = useState<Record<number, boolean>>({});
  const [show,setShow]=useState(false);
  const [message,setMessage]=useState("");
  const [showConformationDiv, setShowConformationDiv] = useState(false);  

  const data = {
    headers: ["Input", "Roll No", "Name"],
    rows: [
      { rollNo: "101", name: "Rahul Sharma" },
      { rollNo: "102", name: "Priya Patel" },
      { rollNo: "103", name: "Amit Verma" },
      { rollNo: "104", name: "Sneha Reddy" },
      { rollNo: "105", name: "Karthik Nair" },
    ],
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
      if (show) {
        const timer = setTimeout(() => setShow(false), 2500);
        return () => clearTimeout(timer);
      }
    }, [show]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Attendance Page</h1>
      <h2 className="animate-bounce w-fit m-auto text-sky-500">Select who are present...</h2>

      <div className="flex flex-1 flex-wrap justify-between items-center">
        <Calendar1 />
        <button className="mt-2 h-fit px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={() => {
                const presentCount = Object.values(checkedRows).filter(Boolean).length;
                setMessage(`Conform to Submit . ${presentCount} students are present.`);
                setShowConformationDiv(true);
            }}
        >Submit Attendance</button>
      </div>

      <table className="border-collapse border border-gray-400 w-full text-left mt-4 rounded-lg overflow-hidden">
        <thead className="bg-sky-400 text-white">
          <tr>
            {data.headers.map((header) => (
              <th key={header} className="border border-gray-400 p-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr
              key={index}
              className={`transition-colors duration-300 ${
                checkedRows[index]
                  ? "bg-green-100"
                  : index % 2 === 0
                  ? "bg-gray-50"
                  : "bg-white"
              }`}
            >
              <td className="border border-gray-400 p-2 text-center">
                <input
                  type="checkbox"
                  checked={!!checkedRows[index]}
                  onChange={() => handleCheckboxChange(index)}
                  className="w-4 h-4 cursor-pointer accent-green-500"
                />
              </td>
              <td className="border border-gray-400 p-2">{row.rollNo}</td>
              <td className="border border-gray-400 p-2">{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {show && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* ✅ Centered Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 z-50
                         -translate-x-1/2 -translate-y-1/2 
                         bg-white text-gray-800 p-6 rounded-2xl shadow-2xl 
                         w-[90%] max-w-[360px]
                         flex flex-col items-center gap-4 overflow-visible"
            >
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <motion.rect
                    x="1"
                    y="1"
                    width="98"
                    height="98"
                    rx="4"
                    ry="4"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    animate={{ strokeDashoffset: [400, 0] }}
                    transition={{
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#04ff64ff" />
                      <stop offset="50%" stopColor="#438bffff" />
                      <stop offset="100%" stopColor="#00ddffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Content */}
              <CheckCircle className="text-green-500 w-12 h-12 z-10" />
              <h2 className="text-xl font-semibold text-center z-10">
                {message}
              </h2>
              

              <motion.button
                onClick={() => setShow(false)}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-6 py-2 rounded-full font-semibold z-10"
              >
                OK
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      <div
        className={`fixed top-0 left-0 bg-black z-40 h-[100vh] w-[100vw] ${
          showConformationDiv ? "block opacity-50" : "hidden"
        }`}
      ></div>

      <div
        className={`fixed inset-0 top-[20vh] left-[70vh] space-y-5 max-w-md h-[40vh] ${
          showConformationDiv ? "block" : "hidden"
        } z-50 w-[70vh] bg-white p-4 shadow-xl rounded-lg`}
      >
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-300 px-3 py-2 rounded-md italic">
  <span className="font-semibold">⚠️ Warning:</span> Once submitted, cannot be changed.
</p>

        <h2 className="w-fit m-auto mt-10 mb-10">{message}</h2>
        <div className="flex justify-between gap-4 mt-4">
            <button
            className="px-4 py-2 bg-blue-500 ml-15 text-white rounded hover:bg-blue-600 transition"
            onClick={() => {
              setShowConformationDiv(false);
              setMessage("Submitted Successfully!");
              setShow(true);
            }}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 mr-15 rounded hover:bg-gray-400 transition"
            onClick={() => setShowConformationDiv(false)}
          >
            Cancel
            </button>
        </div>
      </div>
    </div>
  );
}

export default AttendencePage;
