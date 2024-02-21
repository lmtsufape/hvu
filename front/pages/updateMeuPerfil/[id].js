import React from "react";
import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import UpdateMeuPerfilForm from "../../src/components/UpdateMeuPerfil";
import { SubHeader01 } from "../../src/components/SubHeader";

function UpdateMeuPerfilPage() {
    return (
        <>
        <div>
            < Header03 />
            < SubHeader01 />
            < UpdateMeuPerfilForm />
            < Footer />
        </div>

        </>
    );
}

export default UpdateMeuPerfilPage;
