import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header03 } from "@/components/Lapa/Header";
import Footer from "@/components/Lapa/Footer";
import { SubHeaderGeral } from "@/components/Lapa/SubHeader"; 
import CreateAnimalForm from "@/components/Lapa/CadastrosGerais/Animal/CreateAnimalForm";

function CreateAnimalPage(){
    return(
        <div>
            < Header03 />
            < SubHeaderGeral />
            < CreateAnimalForm />
            < Footer />
        </div>
    )
}

export default CreateAnimalPage;
