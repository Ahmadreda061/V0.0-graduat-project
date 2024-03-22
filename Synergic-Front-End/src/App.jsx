import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./home/Home";
import "./style/App.css";
import Register from "./register/Register";
import { createContext, useState } from "react";
import VendorReg from "./pages/VendorReg";

export const showRegisterContext = createContext();

function App() {
  const [showRegister, setShowRegister] = useState(false);
  function handeleShowReg() {
    setShowRegister((prevShowRegister) => !prevShowRegister);
  }
  return (
    <>
      <showRegisterContext.Provider value={handeleShowReg}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendorRegistertion" element={<VendorReg />} />
        </Routes>
        {showRegister && <Register />}
      </showRegisterContext.Provider>
    </>
  );
}

export default App;
