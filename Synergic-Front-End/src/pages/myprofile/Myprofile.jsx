import { Outlet, useLocation } from "react-router-dom";
import SidebarProfile from "./SidebarProfile";
import "../../style/myprofile-style/myprofile.css";
function Myprofile() {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="myprofile">
      <SidebarProfile />
      <main className="myprofile--pages">
        <nav className="pages--nav">
          <h1 className="section--header">
            {path.slice(path.lastIndexOf("/") + 1)}
          </h1>
          <i className="fa-regular fa-bell fa-fw nav--bell"></i>
        </nav>
        <div className="pages--content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Myprofile;
