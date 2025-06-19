import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateClinicaMedica from "@/components/Fichas/UpdateClinicaMedica";

function UpdateClinicaMedicaPage() {
  return (
    <div className="divPai">
      <Header03 />
      <SubHeader />

      <div className="flexStyle">
        <UpdateClinicaMedica />
      </div>

      <Footer />
    </div>
  );
}

export default UpdateClinicaMedicaPage;
