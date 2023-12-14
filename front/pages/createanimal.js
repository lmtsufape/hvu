import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../src/components/Header/header";
import Footer from "../src/components/Footer/Footer";
import CreateAnimalForm from "@/components/CreateAnimalForm";

function PageCadastroAnimal(){
    return(
        <div>
            <Header03/>
            <CreateAnimalForm/>
            <Footer/>
        </div>
    )
}

export default PageCadastroAnimal;
