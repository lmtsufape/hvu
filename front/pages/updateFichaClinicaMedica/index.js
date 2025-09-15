import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateClinicaMedica from "@/components/Fichas/UpdateClinicaMedica";
import { SubHeaderGeral } from "../../src/components/Lapa/SubHeader";
import { getRoles } from "../../services/userService";

function UpdateClinicaMedicaPage() {
  const role = getRoles();
    
  return (
    <div className="divPai">
      <Header03 />
            
      {role.includes("medico") ? (
          <SubHeader />
      ) : role.includes("patologista") ? (
          <SubHeaderGeral />
      ) : null}

      <div className="flexStyle">
        <UpdateClinicaMedica />
      </div>

      <Footer />
    </div>
  );
}

export default UpdateClinicaMedicaPage;
