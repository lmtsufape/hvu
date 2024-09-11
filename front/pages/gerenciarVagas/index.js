import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarVagas from "../../src/components/GerenciarVagas";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GerenciarVagasPage() {
    return (
        <div className='divPai'>
            <Header03 />
            <SubHeader />
            <div className='flexStyle'>
                <GerenciarVagas />
            </div>
            <Footer />
        </div>
    );
}

export default GerenciarVagasPage;