import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateFichaNeurologica from "@/components/Fichas/UpdateNeurologica";

function UpdateNeurologicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateFichaNeurologica />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateNeurologicoPage;