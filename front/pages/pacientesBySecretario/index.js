import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "../../src/components/SubHeader";
import PacientesBySecretario from "../../src/components/PacientesBySecretario";
import "@/styles/styles.css";

function PacientesBySecretarioPage() {
  return (
    <div className="divPai">
      <Header03 />
      <SubHeader />
      <div className="divCentral">
        <PacientesBySecretario />
      </div>
      <Footer />
    </div>
  );
}

export default PacientesBySecretarioPage;
