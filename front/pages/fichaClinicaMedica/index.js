import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "@/components/Footer";

import "@/styles/styles.css";

/*  O index.jsx dentro de …/Fichas/ClinicaMedica já exporta
    o controller de passos (FichaClinicaMedicaSteps)            */
import ClinicaMedica from "@/components/Fichas/ClinicaMedica";

function ClinicaMedicaPage() {
  return (
    <div className="divPai">
      <Header03 />
      <SubHeader />

      <div className="flexStyle">
        <ClinicaMedica />
      </div>

      <Footer />
    </div>
  );
}

export default ClinicaMedicaPage;
