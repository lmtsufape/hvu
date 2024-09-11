import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import LaudosEmAndamento from "@/components/Lapa/TelaPrincipalLaudos/LaudosEmAndamento";
import { SubHeaderGeral} from "@/components/Lapa/SubHeader";


function LaudosEmAndamentoPage(){
    return(
        <>
        <div>
            <Header03/>
            <SubHeaderGeral />
            <LaudosEmAndamento />
            <Footer />
        </div>

        </>
    );
}

export default LaudosEmAndamentoPage