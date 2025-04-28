import React from "react";
import { Header02 } from "@/components/Header";
import { SubHeader } from "../../src/components/SubHeader";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import CardiologicoStepForm from "@/components/Fichas/CardiologicoStepForm";

function CardiologicoPage() {
    return(
        <div className="divPai">
            < Header02 />
            < SubHeader />
            <div className="flexStyle">
                <CardiologicoStepForm />
            </div>
            < Footer />
        </div>
    );
}

export default CardiologicoPage;
