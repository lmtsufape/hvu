import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import RetornoClinicoSil from "@/components/Fichas/RetornoClinicoSil";

function RetornoClinicoSilPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <RetornoClinicoSil /> 
            </div>
            < Footer />
        </div>
    );
}

export default RetornoClinicoSilPage;