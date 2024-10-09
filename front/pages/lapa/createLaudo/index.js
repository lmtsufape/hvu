import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import CreateLaudo from "@/components/Lapa/CadastrosGerais/Laudo/CreateLaudo";

function createLaudoNecropsiaPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateLaudo />
            < Footer />
        </div>
    )
}

export default createLaudoNecropsiaPage;
