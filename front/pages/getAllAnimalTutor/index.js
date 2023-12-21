import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header"
import Footer from "../../src/components/Footer"
import {SubHeader01} from "../../src/components/SubHeader"
import GetAllAnimalTutorForm from "../../src/components/GetAllAnimalTutorForm"

function PageConsultarAnimalTutor() {
    return (
        <>
        <div>
            < Header03 />
        </div>

        <div>
            < SubHeader01 />
        </div>

        <div>
            < GetAllAnimalTutorForm />
        </div>

        <div>
            < Footer />
        </div>
        </>
    );
}

export default PageConsultarAnimalTutor
