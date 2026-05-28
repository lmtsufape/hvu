import React from "react";
import { Header03 } from "../../../src/components/Lapa/Header";
import Footer from "../../../src/components/Lapa/Footer";
import MeuPerfilList from "../../../src/components/MeuPerfil";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import "@/styles/styles.css";

function LapaMeuPerfilPage() {
    return (
        <div className="divPai">
            < Header03 />
            {/* Opcional: SubHeaderGeral, que vimos na homeAdmin. */}
            < SubHeaderGeral />
            <div className="flexStyle">
                < MeuPerfilList />
            </div>
            < Footer />
        </div>
    );
}

export default LapaMeuPerfilPage;
