import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateAtoCirurgico from "@/components/Fichas/UpdateAtoCirurgico";
import { SubHeaderGeral } from "../../src/components/Lapa/SubHeader";
import { getRoles } from "../../services/userService";

function UpdateAtoCirurgicoPage() {
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
                <UpdateAtoCirurgico /> 
            </div>
            < Footer />
        </div>
    );
}

export default UpdateAtoCirurgicoPage;