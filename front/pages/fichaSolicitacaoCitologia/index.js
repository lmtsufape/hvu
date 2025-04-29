import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import FichaSolicitacaoCitologia from "@/components/Fichas/FichaSolicitacaoCitologia";

function FichaSolicitacaoCitologiaPage() {
    return(
        <div className="divPai">
            < Header02 />
            < SubHeader />
            <div className="flexStyle">
                <FichaSolicitacaoCitologia />
            </div>
            < Footer />
        </div>
    );
}

export default FichaSolicitacaoCitologiaPage;