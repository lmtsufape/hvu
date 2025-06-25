import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateDermatologica from "@/components/Fichas/UpdateDermatologica";

function UpdateDermatologicaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateDermatologica />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateDermatologicaPage;