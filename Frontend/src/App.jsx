import { useState } from "react";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import EmailVerify from "./Pages/EmailVerify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<EmailVerify />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
