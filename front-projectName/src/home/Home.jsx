import React, { useRef } from "react";
import LandingPage from "./LandingPage";
import Categories from "./Categories";
import "../style/home-style/home.css";
import Recomendation from "./Recomendation";
function Home() {
  const cardsContainerRef = useRef(null);

  const handleScrollLeft = () => {
    const container = cardsContainerRef.current;
    container.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    const container = cardsContainerRef.current;
    container.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };
  return (
    <>
      <header>
        <div className="container">
          <LandingPage />
        </div>
      </header>
      <main>
        <div className="container">
          <Categories
            containerRef={cardsContainerRef}
            scrollLeft={handleScrollLeft}
            scrollRight={handleScrollRight}
          />
          <Recomendation />
        </div>
      </main>
    </>
  );
}

export default Home;
