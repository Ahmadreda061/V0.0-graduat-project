import React, {
  useEffect,
  useState,
  createContext,
  lazy,
  Suspense,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./style/App.css";
import "./style/myprofile-style/services.css";
import "./style/myprofile-style/myprofile.css";
import getUser from "./utils/getUser";
import getUserNotfications from "./utils/getUserNotfications";
import Loading from "./components/Loding";
import Chats from "./pages/chats/Chats";

const Home = lazy(() => import("./home/Home"));
const Register = lazy(() => import("./register/Register"));
const VendorReg = lazy(() => import("./pages/VendorReg"));
const Myprofile = lazy(() => import("./pages/myprofile/Myprofile"));
const Services = lazy(() => import("./pages/myprofile/Services"));
const Reviews = lazy(() => import("./pages/myprofile/Reviews"));
const Requests = lazy(() => import("./pages/myprofile/Requests"));
const Navbar = lazy(() => import("./components/Navbar"));
const Information = lazy(() => import("./pages/myprofile/Information"));
const ServiceCreation = lazy(() => import("./pages/ServiceCreation"));
const ServicePreview = lazy(() => import("./components/ServicePreview"));
const Explore = lazy(() => import("./pages/explore/Explore"));

export const userInfoContext = createContext();

function App() {
  const [notifications, setNotifications] = useState([]);
  const [allNotificationsRead, setAllNotificationsRead] = useState(true);
  const [registerOverlay, setRegisterOverlay] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const userName = localStorage.getItem("Key");

  // WebSocket state

  function handleRegisterOverlay() {
    setRegisterOverlay((prevRegisterOverlay) => !prevRegisterOverlay);
  }

  useEffect(() => {
    setShowNavbar(!location.pathname.includes("/myprofile"));
  }, [location.pathname]);

  useEffect(() => {
    if (userName) {
      getUser(userName)
        .then((res) => {
          setUserInfo(res);
          return res.userToken;
        })
        .then((userToken) =>
          getUserNotfications(userToken).then((notifications) =>
            setNotifications(notifications)
          )
        );
    }
  }, [location.pathname, userName]);

  useEffect(() => {
    const unreadNotifications = notifications.some((notification) => {
      const parsedNotification = JSON.parse(notification);
      return !parsedNotification.IsRead;
    });
    setAllNotificationsRead(!unreadNotifications);
  }, [notifications]);

  if (userInfo == null && userName) {
    return <Loading />;
  }

  const contextValues = {
    userInfo,
    setUserInfo,
    notifications,
    setNotifications,
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <userInfoContext.Provider value={contextValues}>
          {showNavbar && (
            <Navbar
              handleRegisterOverlay={handleRegisterOverlay}
              allNotificationsRead={allNotificationsRead}
            />
          )}
          <Routes>
            <Route
              path="/"
              element={<Home handleRegisterOverlay={handleRegisterOverlay} />}
            />
            <Route path="/vendorRegistertion" element={<VendorReg />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/chats" element={<Chats />}></Route>
            <Route path="serviceCreation" element={<ServiceCreation />}></Route>
            <Route path="/servicepreview" element={<ServicePreview />}></Route>
            <Route
              path="/myprofile"
              element={
                <Myprofile allNotificationsRead={allNotificationsRead} />
              }
            >
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
