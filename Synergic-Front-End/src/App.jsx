import { Routes, Route, useLocation } from "react-router-dom";
import { createContext, useEffect, useState, lazy, Suspense } from "react";
import "./style/App.css";
import "./style/myprofile-style/services.css";
import "./style/myprofile-style/myprofile.css";
import getUser from "./utils/getUser";
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
const ServiceCreation = lazy(() => import("./pages/ServiceCreation"));
const ServicePreview = lazy(() => import("./components/ServicePreview"));
const Explore = lazy(() => import("./pages/explore/Explore"));
export const userInfoContext = createContext();

function App() {
  const [registerOverlay, setRegisterOverlay] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const userName = localStorage.getItem("Key");
  function handleRegisterOverlay() {
    setRegisterOverlay((prevRegisterOverlay) => !prevRegisterOverlay);
  }

  useEffect(() => {
    setShowNavbar(!location.pathname.includes("/myprofile")); // if url have myProfile hide the navBar
  }, [location.pathname]);

  useEffect(() => {
    if (userName) {
      getUser(userName).then((res) => setUserInfo(res));
    }
  }, [location.pathname]);

  if (userInfo == null && userName) {
    // if user log in and didn't get the data for any reson render loding the page
    return <Loading />;
  }
  const contextValues = { userInfo, setUserInfo };
  return (
    <>
      {showNavbar && <Navbar handleRegisterOverlay={handleRegisterOverlay} />}
      <Suspense fallback={<Loading />}>
        <userInfoContext.Provider value={contextValues}>
          <Routes>
            <Route
              path="/"
              element={<Home handleRegisterOverlay={handleRegisterOverlay} />}
            />
            <Route path="/vendorRegistertion" element={<VendorReg />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="serviceCreation" element={<ServiceCreation />}></Route>
            <Route path="/servicepreview" element={<ServicePreview />}></Route>
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
