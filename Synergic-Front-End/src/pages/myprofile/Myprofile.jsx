import { Outlet, useLocation } from "react-router-dom";
import SidebarProfile from "./SidebarProfile";
import "../../style/myprofile-style/myprofile.css";
import { createContext, useContext, useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { userInfoContext } from "../../App";
export const UserTokenContext = createContext(null);
function Myprofile() {
  const [showNoitifctions, setShowNoitifctions] = useState(false);
  const { userInfo } = useContext(userInfoContext);
  const [serviceOwnerUserName, setserviceOwnerUserName] = useState(null);
  const [serviceOwnerInfo, setServiceOwnerInfo] = useState(null);
  const location = useLocation();
  const path = location.pathname;
  console.log(showNoitifctions);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setserviceOwnerUserName(searchParams.get("UT"));
  }, []);

  useEffect(() => {
    if (serviceOwnerUserName && userInfo.username != serviceOwnerUserName) {
      getUser(serviceOwnerUserName).then((res) => {
        setServiceOwnerInfo(res);
      });
    }
  }, [serviceOwnerUserName]);
  function handleNoitifctions() {
    setShowNoitifctions((prevState) => !prevState);
  }

  return (
    <UserTokenContext.Provider value={serviceOwnerInfo}>
      <div className="myprofile">
        <SidebarProfile serviceOwnerUserName={serviceOwnerUserName} />
        <main className="myprofile--pages">
          <nav className="pages--nav">
            <h1 className="section--header">
              {path.slice(path.lastIndexOf("/") + 1) === "myprofile"
                ? "Profile"
                : path.slice(path.lastIndexOf("/") + 1)}
            </h1>
            <i
              className="fa-regular fa-bell fa-fw nav--bell"
              onClick={handleNoitifctions}
            ></i>
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
