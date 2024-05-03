import { Outlet, useLocation } from "react-router-dom";
import SidebarProfile from "./SidebarProfile";
import "../../style/myprofile-style/myprofile.css";
import { createContext, useEffect, useState } from "react";
export const UserTokenContext = createContext(null);
function Myprofile() {
  const [userToken, setUserToken] = useState(null);
  const location = useLocation();
  const path = location.pathname;

  // const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("UT");
    setUserToken(token);
  }, []);

  return (
    <UserTokenContext.Provider value={userToken}>
      <div className="myprofile">
        <SidebarProfile />
        <main className="myprofile--pages">
          <nav className="pages--nav">
            <h1 className="section--header">
              {path.slice(path.lastIndexOf("/") + 1) === "myprofile"
                ? "Profile"
                : path.slice(path.lastIndexOf("/") + 1)}
            </h1>
            <i className="fa-regular fa-bell fa-fw nav--bell"></i>
          </nav>
          <div className="pages--content">
            <Outlet />
          </div>
        </main>
      </div>
    </UserTokenContext.Provider>
  );
}

export default Myprofile;
