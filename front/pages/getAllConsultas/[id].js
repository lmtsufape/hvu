import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header";
import Footer from "../../src/components/Footer";
import { SubHeader } from "../../src/components/SubHeader";
import { SubHeaderGeral } from "../../src/components/Lapa/SubHeader";
import { getRoles } from "../../services/userService";
import GetAllConsultas from "../../src/components/GetAllConsultas";
import "@/styles/styles.css"

export default function GetAllConsultasPage(){
    const role = getRoles();

    return(
        <div className="divPai">
            < Header03 />

            {role.includes("medico") ? (
                <SubHeader />
            ) : role.includes("patologista") ? (
                <SubHeaderGeral />
            ) : null}

            <div className="flexStyle">
                < GetAllConsultas />
            </div>
            < Footer />
        </div>
    )
}
