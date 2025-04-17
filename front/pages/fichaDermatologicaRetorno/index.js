import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import DermatologicaRetorno from "@/components/Fichas/DermatologicaRetorno";

function DermatologicaRetornoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <DermatologicaRetorno />
            </div>
            < Footer />
        </div>
    );
}

export default DermatologicaRetornoPage;