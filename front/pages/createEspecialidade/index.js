import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateEspecialidade from "../../src/components/CreateEspecialidade";
import Footer from "../../src/components/Footer";

function CreateEspecialidadePage() {
    return(
        <div>
            < Header03 />
            < SubHeader />
            < CreateEspecialidade />
            < Footer />
        </div>
    );
}

export default CreateEspecialidadePage;