import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import AtendimentoCardiologico from "@/components/Fichas/AtendimentoCardiologico";

function CardiologicoPage() {
    return(
        <div className="divPai">
            < Header02 />
            < SubHeader />
            <div className="flexStyle">
                <AtendimentoCardiologico />
            </div>
            < Footer />
        </div>
    );
}

export default CardiologicoPage;
