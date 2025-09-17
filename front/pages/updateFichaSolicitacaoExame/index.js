import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateFichaSolicitacaoExame from "@/components/Fichas/UpdateSolicitacaoDeExame";
import { SubHeaderGeral } from "../../src/components/Lapa/SubHeader";
import { getRoles } from "../../services/userService";

function UpdateSolicitacaoDeExamepage() {
    const role = getRoles();
    
    return(
        <div className="divPai">
            < Header02 />
            
            {role.includes("medico") ? (
                <SubHeader />
            ) : role.includes("patologista") ? (
                <SubHeaderGeral />
            ) : null}

            <div className="flexStyle">
                <UpdateFichaSolicitacaoExame />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateSolicitacaoDeExamepage;