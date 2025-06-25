import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import UpdateCardiologicoStepForm from "@/components/Fichas/UpdateCardiologico";

function UpdateCardiologicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <UpdateCardiologicoStepForm />
            </div>
            < Footer />
        </div>
    );
}

export default UpdateCardiologicoPage;
