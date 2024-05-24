import React, { useEffect, useState } from "react";
import "../../style/explore/explore.css";
import Filtter from "./Filtter";
import ServiceCard from "../../components/ServiceCard";
import axios from "axios";
import PP from "./PP.jsx";

function Explore() {
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchServices = (offset) => {
    setLoading(true);
    axios
      .get(
        `https://localhost:7200/api/Services/GetServices?&Count=32&Offset=${offset}`
      )
      .then((res) => {
        setAllServices((prevServices) => [
          ...prevServices,
          ...res.data.elements,
        ]);
        setFilteredServices((prevServices) => [
          ...prevServices,
          ...res.data.elements,
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices(offset);
  }, [offset]);

  useEffect(() => {
    const navBar = document.querySelector(".navbar");
    navBar.classList.add("explore");

    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight * 0.63) {
        navBar.classList.add("stopTrans");
        setShowScrollTop(true);
      } else {
        navBar.classList.remove("stopTrans");
        setShowScrollTop(false);
      }
      const content = document.querySelector(".explore--content");
      if (content) {
        const contentBottom = content.getBoundingClientRect().bottom;
        if (contentBottom <= window.innerHeight && !loading) {
          setOffset((prevOffset) => prevOffset + 32);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const handleFilterChange = (selectedCategories) => {
    if (selectedCategories.length === 0) {
      setFilteredServices(allServices);
    } else {
      setFilteredServices(
        allServices.filter((service) =>
          selectedCategories.includes(service.category.toString())
        )
      );
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const serviceCards = filteredServices.map((service, index) => (
    <ServiceCard {...service} key={index} />
  ));

  return (
    <div className="explore">
      <div className="explore--header">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis aut
          quod sapiente mollitia, debitis quidem odit nostrum alias consectetur
          hic sunt tempore velit voluptatibus eius quaerat necessitatibus
          recusandae ipsa. Laborum!
        </p>
        <PP />
      </div>
      <div className="container">
        <div className="explore--content" id="explore--content">
          <Filtter onFilterChange={handleFilterChange} />
          <div className="content-items">
            {serviceCards}
            {loading && <div>Loading...</div>}
          </div>
        </div>
      </div>
      {showScrollTop && (
        <button
          className="scroll-top"
          onClick={scrollToTop}
          style={{ position: "fixed" }}
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
}

export default Explore;
