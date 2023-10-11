import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../src/components/ConsultarAnimalTutor/consultar_animal_tutor.module.css"
import Image from 'next/image';
import {Header03} from "../src/components/Header/header"
import Footer from "../src/components/Footer/Footer"
import {SegundaHeader01} from "../src/components/AnotherHeader/anotherHeader"
import ListarAnimais from "../src/components/ConsultarAnimalTutor/listaranimais"

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
            < ListarAnimais />
        </div>

        <div>
            <Footer />
        </div>
        </>
    );
}

export default PageConsultarAnimalTutor
