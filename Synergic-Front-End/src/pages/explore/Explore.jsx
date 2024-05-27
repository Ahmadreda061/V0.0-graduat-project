import React, { useEffect, useState } from "react";
import "../../style/explore/explore.css";
import Filtter from "./Filtter";
import ServiceCard from "../../components/ServiceCard";
import axios from "axios";
import PP from "./PP.jsx";

function Explore() {
  const [allServices, setAllServices] = useState([]);

  const [count, setCount] = useState(3);
  const [category, setCategories] = useState([]);
  const [rating, setRating] = useState("");
  const [searchBar, setSearchBar] = useState("");

  const [offset, setOffset] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(offset + "---" + count);
  const fetchServices = (newOffset = 0, reset = false) => {
    setLoading(true);
    axios
      .get(
        `https://localhost:7200/api/Services/GetServices?Count=${count}&Offset=${newOffset}&Category=${category}&UserRating=${rating}&SearchBar=${searchBar}`
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
  }, [category, rating, searchBar]);

  useEffect(() => {
    const navBar = document.querySelector(".navbar");
    navBar.classList.add("explore");
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight * 0.6) {
        navBar.classList.add("stopTrans");
        setShowScrollTop(true);
      } else {
        navBar.classList.remove("stopTrans");
        setShowScrollTop(false);
      }
      const content = document.querySelector(".explore--content");
      if (content) {
        // const contentBottom = content.getBoundingClientRect().bottom;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          setTimeout(
            () =>
              setOffset((prevOffset) => {
                const newOffset = prevOffset + count;
                fetchServices(newOffset);
                return newOffset;
              }),
            300
          );
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

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
            setRating={(rating) => {
              setRating(rating);
              setOffset(0);
            }}
            rating={rating}
            searchBar={searchBar}
            setSearchBar={(value) => {
              setSearchBar(value);
              setOffset(0);
            }}
            offset={offset}
          />
          <div className="content-items">{serviceCards}</div>
          {/* {loading && <Loding />} */}
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
