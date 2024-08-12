import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import CreateLaudoMicroscopia from "@/components/Lapa/CadastrosGerais/LaudoMicroscopia/CreateLaudo";

function createLaudoNecropsiaPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateLaudoMicroscopia />
            < Footer />
        </div>
    )
}

export default createLaudoNecropsiaPage;
