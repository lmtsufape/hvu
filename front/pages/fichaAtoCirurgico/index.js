import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import AtoCirurgico from "@/components/Fichas/AtoCirurgico";

function AtoCirurgicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <AtoCirurgico /> 
            </div>
            < Footer />
        </div>
    );
}

export default AtoCirurgicoPage;