import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateRaca from "../../src/components/CreateRacaForm";
import Footer from "../../src/components/Footer";

function CreateRacaPage() {
    return(
        <div>
            < Header03 />
            < SubHeader />
            < CreateRaca />
            < Footer />
        </div>
    );
}

export default CreateRacaPage;