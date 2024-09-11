import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "@/components/SubHeader";
import CreateMedico from "@/components/CreateMedico";
import "@/styles/styles.css"

function CreateMedicoPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < CreateMedico />
            </div>
            < Footer />
        </div>
    )
}

export default CreateMedicoPage;
