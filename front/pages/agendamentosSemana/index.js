import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader} from "../../src/components/SubHeader";
import GetAllAgendamentosSemanaForm from "../../src/components/GetAllAgendamentoSemanaForm";
import Footer from "../../src/components/Footer";
import "@/styles/styles.css";

function GetAllAgendamentosSemanaPage() {
    return (
        <div className="divPai">
            <Header03 />
            <SubHeader />
            <div className="flexStyle">
                <GetAllAgendamentosSemanaForm />
            </div>
            <Footer />
        </div>
    );
}

export default GetAllAgendamentosSemanaPage;
