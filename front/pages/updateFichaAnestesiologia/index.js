import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";

import UpdateAnestesiologiaSteps from "@/components/Fichas/UpdateAnestesiologia";

export default function UpdateAnestesiologiaPage() {
  return (
    <div className="divPai">
      <Header03 />
      <SubHeader />
      <div className="flexStyle">
        <UpdateAnestesiologiaSteps />
      </div>
      <Footer />
    </div>
  );
}
