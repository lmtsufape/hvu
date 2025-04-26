import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import FichaNeurologica from "@/components/Fichas/NeurologicaStepForm";

function NeurologicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <FichaNeurologica />
            </div>
            < Footer />
        </div>
    );
}

export default NeurologicoPage;