import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateReabilitacaoIntegrativa from "@/components/Fichas/UpdateReabilitacaoIntegrativa";
import { SubHeaderGeral } from "../../src/components/Lapa/SubHeader";
import { getRoles } from "../../services/userService";


function UpdateReabilitacaoIntegrativaPage() {
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
                <UpdateReabilitacaoIntegrativa /> 
            </div>
            < Footer />
        </div>
    );
}

export default UpdateReabilitacaoIntegrativaPage;