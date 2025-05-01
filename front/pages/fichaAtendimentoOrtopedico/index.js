import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import AtendimentoOrtopedico from "@/components/Fichas/OrtopedicoStepForm";

function AtendimentoOrtopedicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <AtendimentoOrtopedico /> 
            </div>
            < Footer />
        </div>
    );
}

export default AtendimentoOrtopedicoPage;