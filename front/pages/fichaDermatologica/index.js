import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import Dermatologica from "@/components/Fichas/DermatologicaStepForm";

function DermatologicaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <Dermatologica />
            </div>
            < Footer />
        </div>
    );
}

export default DermatologicaPage;