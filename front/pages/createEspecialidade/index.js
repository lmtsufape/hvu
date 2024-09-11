import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateEspecialidade from "../../src/components/CreateEspecialidade";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function CreateEspecialidadePage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
            < CreateEspecialidade />
            </div>
            < Footer />
        </div>
    );
}

export default CreateEspecialidadePage;