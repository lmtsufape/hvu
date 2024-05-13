import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateEspecie from "../../src/components/CreateEspecie";
import Footer from "../../src/components/Footer";

function CreateEspeciePage() {
    return(
        <div>
            < Header03 />
            < SubHeader />
            < CreateEspecie />
            < Footer />
        </div>
    );
}

export default CreateEspeciePage;