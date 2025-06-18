import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateReabilitacaoIntegrativa from "@/components/Fichas/UpdateReabilitacaoIntegrativa";


function UpdateReabilitacaoIntegrativaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateReabilitacaoIntegrativa /> 
            </div>
            < Footer />
        </div>
    );
}

export default UpdateReabilitacaoIntegrativaPage;