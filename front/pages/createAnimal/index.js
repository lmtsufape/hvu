import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "@/components/SubHeader";
import CreateAnimalForm from "@/components/CreateAnimalForm";

function CreateAnimalPage(){
    return(
        <div>
            < Header03 />
            < SubHeader />
            < CreateAnimalForm />
            < Footer />
        </div>
    )
}

export default CreateAnimalPage;
