import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader02 } from "@/components/SubHeader";
import CreateMedico from "@/components/CreateMedico";

function CreateMedicoPage(){
    return(
        <div>
            < Header03 />
            < SubHeader02 />
            < CreateMedico />
            < Footer />
        </div>
    )
}

export default CreateMedicoPage;
