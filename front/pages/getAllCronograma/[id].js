import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header"
import Footer from "../../src/components/Footer"
import {SubHeader02} from "../../src/components/SubHeader"
import GetAllCronograma from "../../src/components/GetAllCronograma"

function GetAllCronogramaPage() {
    return (
        <div>
            < Header03 />
            < SubHeader02 />
            < GetAllCronograma />
            < Footer />
        </div>
    );
}

export default GetAllCronogramaPage;
