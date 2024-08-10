import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader";
import CreateMicroscopia from "@/components/Lapa/CadastrosGerais/Microscopia/CreateMicroscopia";

function createCampoMicroscopiaPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateMicroscopia />
            < Footer />
        </div>
    )
}

export default createCampoMicroscopiaPage;
