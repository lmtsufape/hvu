import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "@/components/Footer";

import "@/styles/styles.css";

import ClinicaMedicaSilvestres from "@/components/Fichas/ClinicaMedicaSilvestres";

function ClinicaMedicaSilvestresPage() {
  return (
    <div className="divPai">
      <Header03 />
      <SubHeader />

      <div className="flexStyle">
        <ClinicaMedicaSilvestres />
      </div>

      <Footer />
    </div>
  );
}

export default ClinicaMedicaSilvestresPage;
