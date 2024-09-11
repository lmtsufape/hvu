import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader} from "../../src/components/SubHeader";
import ProximasConsultasTutor from "../../src/components/ProximasConsultasTutor/proximasConsultasTutor";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function ProximasConsultasTutorPage() {
    return (
        <div className="divPai">
            <Header03 />
            <SubHeader />
            <div className="flexStyle">
                <ProximasConsultasTutor />
            </div>
            <Footer />
        </div>
    );
}

export default ProximasConsultasTutorPage