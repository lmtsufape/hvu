import React from "react";
import { Header03 } from "../../../src/components/Lapa/Header";
import Footer from "../../../src/components/Lapa/Footer";
import UpdateMeuPerfil from "../../../src/components/UpdateMeuPerfil";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import "@/styles/styles.css";

function LapaUpdateMeuPerfilPage() {
    return (
        <div className="divPai">
            < Header03 />
            < SubHeaderGeral />
            <UpdateMeuPerfil />
            < Footer />
        </div>
    );
}

export default LapaUpdateMeuPerfilPage;
