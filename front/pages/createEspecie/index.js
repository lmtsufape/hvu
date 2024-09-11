import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateEspecie from "../../src/components/CreateEspecie";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function CreateEspeciePage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < CreateEspecie />
            </div>
            < Footer />
        </div>
    );
}

export default CreateEspeciePage;