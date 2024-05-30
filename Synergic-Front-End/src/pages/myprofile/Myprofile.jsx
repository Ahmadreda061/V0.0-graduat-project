import { Outlet, useLocation } from "react-router-dom";
import SidebarProfile from "./SidebarProfile";
import "../../style/myprofile-style/myprofile.css";
import { createContext, useContext, useEffect, useState } from "react";
import getUser from "../../utils/getUser";
import { userInfoContext } from "../../App";
import makeAllRead from "../../utils/makeAllRead";
import Notfications from "./myprofile-component/Notfications";
export const UserTokenContext = createContext(null);

function Myprofile({ allNotificationsRead }) {
  const [showNoitifctions, setShowNoitifctions] = useState(false);
  const { userInfo, notifications } = useContext(userInfoContext);
  const [otherUserName, setotherUserName] = useState(null);
  const [otherUserInfo, setotherUserInfo] = useState(null);
  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setotherUserName(searchParams.get("UT"));
  }, []);

  useEffect(() => {
    if (otherUserName && userInfo.username != otherUserName) {
      getUser(otherUserName).then((res) => {
        setotherUserInfo(res);
      });
    }
  }, [otherUserName]);

  function handleNoitifctions() {
    setShowNoitifctions((prevState) => !prevState);
  }

  return (
    <UserTokenContext.Provider value={otherUserInfo}>
      <div className="myprofile">
        <SidebarProfile
          otherUserInfo={otherUserInfo}
          otherUserName={otherUserName}
        />
        <main className="myprofile--pages">
          <nav className="pages--nav">
            <h1 className="section--header">
              {path.slice(path.lastIndexOf("/") + 1) === "myprofile"
                ? "Profile"
                : path.slice(path.lastIndexOf("/") + 1)}
            </h1>
            <div>
              {!allNotificationsRead && (
                <span
                  style={{ top: "initial", right: "35px" }}
                  className="circle-red"
                ></span>
              )}

              <i
                className="fa-regular fa-bell fa-fw nav--bell"
                onClick={() => (
                  handleNoitifctions(),
                  makeAllRead(userInfo.userToken, notifications)
                )}
              ></i>
            </div>

            {showNoitifctions && <Notfications />}
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
