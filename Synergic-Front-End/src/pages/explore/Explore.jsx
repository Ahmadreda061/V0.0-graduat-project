// In your Explore component
import React, { useEffect, useState } from "react";
import "../../style/explore/explore.css";
import Filtter from "./Filtter";
import ServiceCard from "../../components/ServiceCard";
import axios from "axios";
import PP from "./PP.jsx";
import Loading from "../../components/Loding.jsx";

function Explore() {
  const [allServices, setAllServices] = useState([]);
  const [count, setCount] = useState(3);
  const [category, setCategories] = useState([]);
  const [offset, setOffset] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchServices = (newOffset = 0, reset = false) => {
    setLoading(true);
    axios
      .get(
        `https://localhost:7200/api/Services/GetServices?Count=${count}&Offset=${newOffset}&Category=${category}`
      )
      .then((res) => {
        setAllServices((prevServices) =>
          reset ? res.data.elements : [...prevServices, ...res.data.elements]
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServices(0, true);
  }, [category]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight * 0.63) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      const content = document.querySelector(".explore--content");
      if (content) {
        const contentBottom = content.getBoundingClientRect().bottom;
        if (contentBottom <= window.innerHeight + 100 && !loading) {
          setOffset((prevOffset) => {
            const newOffset = prevOffset + count;
            fetchServices(newOffset);
            return newOffset;
          });
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, count]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const serviceCards = allServices.map((service, index) => (
    <ServiceCard {...service} key={index} />
  ));

  return (
    <div className="explore">
      <div className="explore--header">
        <PP />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis aut
          quod sapiente mollitia, debitis quidem odit nostrum alias consectetur
          hic sunt tempore velit voluptatibus eius quaerat necessitatibus
          recusandae ipsa. Laborum!
        </p>
      </div>
      <div className="container">
        <div className="explore--content" id="explore--content">
          <Filtter
            setCategories={(categories) => {
              setCategories(categories);
              setOffset(0);
            }}
            category={category}
            setCount={setCount}
          />
          <div className="content-items">{serviceCards}</div>

          {loading && <Loading />}
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
