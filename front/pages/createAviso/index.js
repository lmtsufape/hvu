import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateAviso from "../../src/components/CreateAviso";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function CreateEspecialidadePage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
            < CreateAviso />
            </div>
            < Footer />
        </div>
    );
}

export default CreateEspecialidadePage;