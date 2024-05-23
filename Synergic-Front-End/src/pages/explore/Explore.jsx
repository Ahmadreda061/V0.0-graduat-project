import React, { useEffect, useState } from "react";
import "../../style/explore/explore.css";
import Filtter from "./Filtter";
import ServiceCard from "../../components/ServiceCard";
import axios from "axios";
import PP from "./PP.jsx";

function Explore() {
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    axios
      .get(`https://localhost:7200/api/Services/GetServices?&Count=${100000}`)
      .then((res) => setAllServices(res.data));
  }, []);

  useEffect(() => {
    const navBar = document.querySelector(".navbar");
    navBar.classList.add("explore");
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        navBar.classList.add("stopTrans");
      } else {
        navBar.classList.remove("stopTrans");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const serviceCards = allServices.map((service, index) => (
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
        <div className="explore--content">
          <Filtter />
          <div className="content-items">{serviceCards}</div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
