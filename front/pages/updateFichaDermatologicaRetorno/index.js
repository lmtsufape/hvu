import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateDermatologicaRetorno from "@/components/Fichas/UpdateDermatologicaRetorno";

function UpdateDermatologicaRetornoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateDermatologicaRetorno />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateDermatologicaRetornoPage;