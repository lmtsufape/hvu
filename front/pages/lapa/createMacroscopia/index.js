import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import CreateCampoLaudo from "@/components/Lapa/CadastrosGerais/Macroscopia/CreateMacroscopia";

function createCampoLaudoPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateCampoLaudo />
            < Footer />
        </div>
    )
}

export default createCampoLaudoPage;
