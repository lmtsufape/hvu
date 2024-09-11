import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "../../src/components/SubHeader";
import GetAllConsultas from "../../src/components/GetAllConsultas";
import "@/styles/styles.css"

export default function GetAllConsultasPage(){
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < GetAllConsultas />
            </div>
            < Footer />
        </div>
    )
}
