import React from "react";
import LandingPage from "./LandingPage";
import Categories from "./Categories";

import "../style/home-style/home.css";
function Home() {
  return (
    <main>
      <div className="container">
        <LandingPage />
        <Categories />
      </div>
    </main>
  );
}

export default Home;
