import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header"
import Footer from "../../src/components/Footer"
import {SubHeader02} from "../../src/components/SubHeader"
import GetAllCronogramaByMedico from "../../src/components/GetAllCronogramaByMedico"

function GGetAllCronogramaByMedicoPage() {
    return (
        <div>
            < Header03 />
            < SubHeader02 />
            < GetAllCronogramaByMedico />
            < Footer />
        </div>
    );
}

export default GGetAllCronogramaByMedicoPage;
