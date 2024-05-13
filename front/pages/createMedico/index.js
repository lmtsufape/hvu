import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "@/components/SubHeader";
import CreateMedico from "@/components/CreateMedico";

function CreateMedicoPage(){
    return(
        <div>
            < Header03 />
            < SubHeader />
            < CreateMedico />
            < Footer />
        </div>
    )
}

export default CreateMedicoPage;
