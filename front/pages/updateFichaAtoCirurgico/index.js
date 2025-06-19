import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateAtoCirurgico from "@/components/Fichas/UpdateAtoCirurgico";

function UpdateAtoCirurgicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateAtoCirurgico /> 
            </div>
            < Footer />
        </div>
    );
}

export default UpdateAtoCirurgicoPage;