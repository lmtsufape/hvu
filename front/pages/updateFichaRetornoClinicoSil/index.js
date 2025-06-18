import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateRetornoClinicoSil from "@/components/Fichas/UpdateRetornoClinicoSil";

function UpdateRetornoClinicoSilPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateRetornoClinicoSil /> 
            </div>
            < Footer />
        </div>
    );
}

export default UpdateRetornoClinicoSilPage;