import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import TelaHomeLaudos from "@/components/Lapa/TelaPrincipalLaudos";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";
import NewRequest from "@/components/Lapa/TelaPrincipalLaudos/NovosLaudos";

function NewRequestPage() {
    return (
        <>
        <div>
            < Header03 />
            < SubHeaderGeral />
            < NewRequest />
            < Footer />
        </div>

        </>
    );
}

export default NewRequestPage
