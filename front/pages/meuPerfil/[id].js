import React from "react";
import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import MeuPerfilList from "../../src/components/MeuPerfil";
import { SubHeader01 } from "../../src/components/SubHeader";

function MainSecretarioPage() {
    return (
        <>
        <div>
            < Header03 />
            < SubHeader01 />
            < MeuPerfilList />
            < Footer />
        </div>

        </>
    );
}

export default MainSecretarioPage;
