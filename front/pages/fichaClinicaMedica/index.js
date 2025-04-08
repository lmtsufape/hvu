import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import FichaClinicaMedica from "@/components/Fichas/FichaClinicaMedica";


function SessaoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <FichaClinicaMedica /> 
            </div>
            < Footer />
        </div>
    );
}

export default FichaClinicaMedica;