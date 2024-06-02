import GreenTick from "../assets/GreenTick.jpg";
import Navbar from "@/components/Sections/Navbar";
import React, { useState, useEffect } from "react";

const EmailVerify = () => {
  const [emailContent, setEmailContent] = useState("");
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://greenlock-1.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails: [emailContent] }),
      });
      const data = await response.json();
      setResult(data.isPhishing);
      setConfidence(data.confidenceScore);
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                alt=""
                src={GreenTick}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="lg:py-24">
              <div>
                <label
                  htmlFor="OrderNotes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Content
                </label>

                <textarea
                  id="OrderNotes"
                  className="mt-2 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
                  rows="4"
                  placeholder="Enter your content here..."
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                ></textarea>
              </div>

              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handlePrediction}
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict"}
              </button>

              {result !== null && (
                <div className="mt-4">
                  <h2 className="text-xl font-semibold">
                    {result ? "Phishing" : "Legitimate"}
                  </h2>
                  <p className="text-gray-600">
                    Confidence Score: {confidence}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EmailVerify;

// import GreenTick from "../assets/GreenTick.jpg";
// import Navbar from "@/components/Sections/Navbar";
// import React from "react";

// const EmailVerify = () => {
//   return (
//     <>
//       <Navbar />
//       <section>
//         <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
//           <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
//             <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
//               <img
//                 alt=""
//                 src={GreenTick}
//                 className="absolute inset-0 h-full w-full object-cover"
//               />
//             </div>

//             <div className="lg:py-24">
//               <div>
//                 <label
//                   htmlFor="OrderNotes"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email Content
//                 </label>

//                 <textarea
//                   id="OrderNotes"
//                   className="mt-2 w-full rounded-lg border-gray-200 align-top shadow-sm sm:text-sm"
//                   rows="4"
//                   placeholder="Enter your content here..."
//                 ></textarea>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default EmailVerify;
