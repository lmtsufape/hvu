import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "@/components/SubHeader";
import CreateAnimalForm from "@/components/CreateAnimalForm";
import "@/styles/styles.css"

function CreateAnimalPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < CreateAnimalForm />
            </div>
            < Footer />
        </div>
    )
}

export default CreateAnimalPage;
