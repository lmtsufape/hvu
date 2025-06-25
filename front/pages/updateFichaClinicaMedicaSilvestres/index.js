import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateClinicaMedicaSilvestres from "@/components/Fichas/UpdateClinicaMedicaSilvestres";

function UpdateClinicaMedicaSilvestresPage() {
  return (
    <div className="divPai">
      <Header03 />
      <SubHeader />

      <div className="flexStyle">
        <UpdateClinicaMedicaSilvestres />
      </div>

      <Footer />
    </div>
  );
}

export default UpdateClinicaMedicaSilvestresPage;
