import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader01 } from "@/components/SubHeader";
import CreateAnimalForm from "@/components/CreateAnimalForm";

function PageCadastroAnimal(){
    return(
        <div>
            < Header03 />
            < SubHeader01 />
            < CreateAnimalForm />
            < Footer />
        </div>
    )
}

export default PageCadastroAnimal;
