import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "../../../src/components/Lapa/Header";
import Footer from "../../../src/components/Lapa/Footer";
import InterfaceUsuario from "../../../src/components/Lapa/MainUserInterface";

function InterfaceUsuarioPage() {
    return (
        <div>
            <Header03 />
            <InterfaceUsuario />
            <Footer />
        </div>
    );
}

export default InterfaceUsuarioPage;