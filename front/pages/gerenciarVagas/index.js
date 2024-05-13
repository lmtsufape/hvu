import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import GerenciarVagas from "../../src/components/GerenciarVagas";
import Footer from "../../src/components/Footer";

function GerenciarVagasPage() {
    return(
        <div>
            < Header03 />
            < SubHeader />
            < GerenciarVagas />
            < Footer />
        </div>
    );
}

export default GerenciarVagasPage;