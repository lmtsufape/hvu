import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateAtendimentoOrtopedico from "@/components/Fichas/UpdateOrtopedico";

function UpdateAtendimentoOrtopedicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateAtendimentoOrtopedico /> 
            </div>
            < Footer />
        </div>
    );
}

export default UpdateAtendimentoOrtopedicoPage;