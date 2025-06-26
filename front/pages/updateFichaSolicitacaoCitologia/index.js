import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateFichaSolicitacaoCitologia from "@/components/Fichas/UpdateFichaSolicitacaoCitologia";

function UpdateFichaSolicitacaoCitologiaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateFichaSolicitacaoCitologia />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateFichaSolicitacaoCitologiaPage;