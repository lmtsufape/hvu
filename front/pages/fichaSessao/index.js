import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import Sessao from "@/components/Fichas/Sessao";

function SessaoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <Sessao /> 
            </div>
            < Footer />
        </div>
    );
}

export default SessaoPage;