import React from "react";
import { Header03 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import MeuPerfilList from "../../src/components/MeuPerfil";
import { SubHeader } from "../../src/components/SubHeader";
import "@/styles/styles.css";

function MainSecretarioPage() {
    return (
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
            < MeuPerfilList />
            </div>
            < Footer />
        </div>
    );
}

export default MainSecretarioPage;
