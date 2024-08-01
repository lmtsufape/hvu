import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header"
import Footer from "../../src/components/Footer"
import {SubHeader} from "../../src/components/SubHeader"
import GetAllCronograma from "../../src/components/GetAllCronograma"
import "@/styles/styles.css"

function GetAllCronogramaPage() {
    return (
        <div className="divPai">
            < Header03 />
            < SubHeader />
            <div className="flexStyle">
                < GetAllCronograma />
            </div>
            < Footer />
        </div>
    );
}

export default GetAllCronogramaPage;
