import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarAuthor from "../components/NavbarAuthor";
import SidebarAuthor from "../components/SidebarAuthor";
import WebShell from "../components/WebShell";
import "../assets/DetailPraktikum.css";

function DetailPraktikum() {
  const { slug } = useParams();
  const [praktikum, setPraktikum] = useState(null);

  useEffect(() => {
    const fetchPraktikum = async () => {
      try {
        const result = await axios.get(
          `http://localhost:3007/praktikum/${slug}`
        );
        setPraktikum(result.data);
      } catch (error) {
        console.error("Error fetching praktikum:", error);
      }
    };
    fetchPraktikum();
  }, [slug]);

  if (!praktikum) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarAuthor />
      <div className="DetailPraktikumBody">
        <SidebarAuthor />
        <div className="DetailPraktikumContent">
          <h1>{praktikum.title}</h1>
          <p>
            <strong>Image Name:</strong> {praktikum.imageName}
          </p>
          <p>
            <strong>Target Machine:</strong> {praktikum.targetMachine}
          </p>
          <div className="DetailPraktikumSteps">
            <h2>Steps:</h2>
            <div dangerouslySetInnerHTML={{ __html: praktikum.description }} />
          </div>
          <WebShell praktikumId={praktikum.id} />
        </div>
      </div>
    </div>
  );
}

export default DetailPraktikum;
