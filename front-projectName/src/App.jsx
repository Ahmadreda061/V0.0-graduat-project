import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./home/Home";
import "./style/App.css";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
