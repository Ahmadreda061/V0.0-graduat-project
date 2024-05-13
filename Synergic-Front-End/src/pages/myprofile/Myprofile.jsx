import { Outlet, useLocation } from "react-router-dom";
import SidebarProfile from "./SidebarProfile";
import "../../style/myprofile-style/myprofile.css";
import { createContext, useContext, useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { userInfoContext } from "../../App";
export const UserTokenContext = createContext(null);
function Myprofile() {
  const { userInfo } = useContext(userInfoContext);
  const [serviceOwnerToken, setServiceOwnerToken] = useState(null);
  const [serviceOwnerInfo, setServiceOwnerInfo] = useState(null);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setServiceOwnerToken(searchParams.get("UT"));
  }, []);

  useEffect(() => {
    if (serviceOwnerToken && userInfo.userToken != serviceOwnerToken) {
      getUser(serviceOwnerToken).then((res) => {
        setServiceOwnerInfo(res);
      });
    }
  }, [serviceOwnerToken]);

  return (
    <UserTokenContext.Provider value={serviceOwnerInfo}>
      <div className="myprofile">
        <SidebarProfile serviceOwnerToken={serviceOwnerInfo} />
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
