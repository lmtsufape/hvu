import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import SystemForm from "@/components/SystemForm";
import Footer from "@/components/Footer";
import "@/styles/styles.css";

function SystemPage() {
  return (
    <div className="divPai">
      <Header02 />
      <SubHeader />
      <div className="flexStyle">
        <SystemForm />
      </div>
      <Footer />
    </div>
  );
}

export default SystemPage;
