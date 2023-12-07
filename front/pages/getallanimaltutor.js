import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../src/components/Header/header"
import Footer from "../src/components/Footer/Footer"
import {SegundaHeader01} from "../src/components/AnotherHeader/anotherHeader"
import GetAllAnimalTutorForm from "../src/components/GetAllAnimalTutorForm"

function PageConsultarAnimalTutor() {
    return (
        <>
        <div>
            <Header03 />
        </div>

        <div>
            < SegundaHeader01 />
        </div>

        <div>
            < GetAllAnimalTutorForm />
        </div>

        <div>
            <Footer />
        </div>
        </>
    );
}

export default PageConsultarAnimalTutor
