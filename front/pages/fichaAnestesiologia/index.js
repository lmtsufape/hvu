import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";

import AnestesiologiaSteps from "@/components/Fichas/Anestesiologia";

export default function AnestesiologiaPage() {
  return (
    <div className="divPai">
      <Header03 />
      <SubHeader />
      <div className="flexStyle">
        <AnestesiologiaSteps />
      </div>
      <Footer />
    </div>
  );
}
