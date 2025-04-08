import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import FichaSolicitacaoExame from "@/components/Fichas/SolicitacaoDeExame";

function SolicitacaoDeExamepage() {
    return(
        <div className="divPai">
            < Header02 />
            < SubHeader />
            <div className="flexStyle">
                <FichaSolicitacaoExame />
            </div>
            < Footer />
        </div>
    );
}

export default SolicitacaoDeExamepage;