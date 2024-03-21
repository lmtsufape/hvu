import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader02 } from "../../src/components/SubHeader";
import GerenciarVagas from "../../src/components/GerenciarVagas";
import Footer from "../../src/components/Footer";

function GerenciarVagasPage() {
    return(
        <div>
            < Header03 />
            < SubHeader02 />
            < GerenciarVagas />
            < Footer />
        </div>
    );
}

export default GerenciarVagasPage;