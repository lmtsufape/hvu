import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateFichaSolicitacaoExame from "@/components/Fichas/UpdateSolicitacaoDeExame";

function UpdateSolicitacaoDeExamepage() {
    return(
        <div className="divPai">
            < Header02 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateFichaSolicitacaoExame />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateSolicitacaoDeExamepage;