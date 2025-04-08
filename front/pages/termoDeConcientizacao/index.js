import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import TermoDeConcientizacao from "@/components/Fichas/TermoDeConcientizacao";

function TermoDeConcientizacaoPage() {
    return(
        <div className="divPai">
            < Header02 />
            < SubHeader />
            <div className="flexStyle">
                <TermoDeConcientizacao />
            </div>
            < Footer />
        </div>
    );
}

export default TermoDeConcientizacaoPage;