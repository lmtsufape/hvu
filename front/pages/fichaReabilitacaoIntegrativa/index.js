import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import ReabilitacaoIntegrativa from "@/components/Fichas/ReabilitacaoIntegrativa";


function ReabilitacaoIntegrativaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <ReabilitacaoIntegrativa /> 
            </div>
            < Footer />
        </div>
    );
}

export default ReabilitacaoIntegrativaPage;