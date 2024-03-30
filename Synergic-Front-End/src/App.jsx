import { Routes, Route, useLocation } from "react-router-dom";
import { createContext, useEffect, useState, lazy, Suspense } from "react";
import "./style/App.css";
import axios from "axios";
const Home = lazy(() => import("./home/Home"));
const Register = lazy(() => import("./register/Register"));
const VendorReg = lazy(() => import("./pages/VendorReg"));
const Myprofile = lazy(() => import("./pages/myprofile/Myprofile"));
const Services = lazy(() => import("./pages/myprofile/Services"));
const Reviews = lazy(() => import("./pages/myprofile/Reviews"));
const Requests = lazy(() => import("./pages/myprofile/Requests"));
const Navbar = lazy(() => import("./components/Navbar"));
const Information = lazy(() => import("./pages/myprofile/Information"));
const Loading = lazy(() => import("./components/Loding"));
export const userInfoContext = createContext();

function App() {
  const [registerOverlay, setRegisterOverlay] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const userKey = localStorage.getItem("Key");
  function handleRegisterOverlay() {
    setRegisterOverlay((prevRegisterOverlay) => !prevRegisterOverlay);
  }
  useEffect(() => {
    setShowNavbar(!location.pathname.includes("/myprofile"));
  }, [location.pathname]);
  useEffect(() => {
    if (userKey)
      axios
        .get(
          `https://localhost:7200/api/Accounts/GetProfile?UserToken=${localStorage.getItem(
            "Key"
          )}`
        )
        .then((res) => res.data)
        .then((data) => {
          setUserInfo(data);
        });
  }, []);

  if (userInfo == null && userKey) {
    // if user log in and didn't get the data for any reson render loding the page
    return <Loading />;
  }
  return (
    <>
      <Suspense fallback={<Loading />}>
        {showNavbar && <Navbar handleRegisterOverlay={handleRegisterOverlay} />}
        <userInfoContext.Provider value={userInfo}>
          <Routes>
            <Route
              index
              element={<Home handleRegisterOverlay={handleRegisterOverlay} />}
            />
            <Route path="/vendorRegistertion" element={<VendorReg />} />
            <Route path="/myprofile" element={<Myprofile />}>
              <Route index element={<Information />}></Route>
              <Route path="services" element={<Services />}></Route>
              <Route path="reviews" element={<Reviews />}></Route>
              <Route path="requests" element={<Requests />}></Route>
            </Route>
          </Routes>
        </userInfoContext.Provider>

        {registerOverlay && (
          <Register handleRegisterOverlay={handleRegisterOverlay} />
        )}
      </Suspense>
    </>
  );
}

export default App;
