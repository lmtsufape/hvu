import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03 } from "@/components/Lapa/Header"; 
import Footer from "@/components/Lapa/Footer";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import MeusAnimaisList from "@/components/Lapa/CadastrosGerais/Animal/MeusAnimais";

function MeusAnimaisPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>

        <div>
            < SubHeaderGeral />
        </div>

        <div>
            < MeusAnimaisList />
        </div>

        <div>
            < Footer />
        </div>
        </>
    );
}

export default MeusAnimaisPage;
