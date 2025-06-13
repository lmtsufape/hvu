import React from "react";
import { Header03 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import CardiologicoStepForm from "@/components/Fichas/CardiologicoStepForm";

function CardiologicoPage() {
    return(
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                <CardiologicoStepForm />
            </div>
            < Footer />
        </div>
    );
}

export default CardiologicoPage;
