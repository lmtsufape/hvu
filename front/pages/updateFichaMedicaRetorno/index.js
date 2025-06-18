import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateFichaMedicaRetorno from "@/components/Fichas/UpdateMedicoRetorno";

function UpdateMedicoRetornoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateFichaMedicaRetorno />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateMedicoRetornoPage;