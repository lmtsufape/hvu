import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import Contato from "@/components/ContatoForm";


function ContatoPage() {
    return(
        <div className="divPai">
            < Header02 />
            < SubHeader />
            <div className="flexStyle">
                <Contato />
            </div>
            < Footer />
        </div>
    );
}

export default ContatoPage;
