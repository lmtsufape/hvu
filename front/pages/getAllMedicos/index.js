import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {Header03} from "../../src/components/Header"
import Footer from "../../src/components/Footer"
import {SubHeader} from "../../src/components/SubHeader"
import GetAllMedicos from "../../src/components/GetAllMedicos"
import "@/styles/styles.css";

function GetAllMedicosPage() {
    return (
        <div className='divPai'>
            <Header03 />
            <SubHeader />
            <div className='flexStyle'>
                <GetAllMedicos />
            </div>
            <Footer />
        </div>
    );
}

export default GetAllMedicosPage;
