import { useEffect, useState } from "react";
import "../../style/explore/explore.css";
import Filtter from "./Filtter";
import ServiceCard from "../../components/ServiceCard";
import axios from "axios";

function Explore() {
  const [allServices, setAllServices] = useState([]);
  useEffect(() => {
    axios
      .get(`https://localhost:7200/api/Services/GetServices?&Count=${100000}`)
      .then((res) => setAllServices(res.data));
  }, []);
  const serviceCards = allServices.map((service, index) => (
    <ServiceCard {...service} key={index} />
  ));
  return (
    <div className="explore">
      <div className="container">
        <div className="explore--content">
          <Filtter />
          <div className="content-items">
            {serviceCards} {serviceCards} {serviceCards} {serviceCards}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
