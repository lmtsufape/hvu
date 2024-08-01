import React from "react";
import { Header03 } from "../../src/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import CreateRaca from "../../src/components/CreateRacaForm";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function CreateRacaPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < CreateRaca />
            </div>
            < Footer />
        </div>
    );
}

export default CreateRacaPage;