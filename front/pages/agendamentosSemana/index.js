import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import GetAllAgendamentosSemanaForm from "../../src/components/GetAllAgendamentoSemanaForm";
import Footer from "../../src/components/Footer";

function GetAllAgendamentosSemanaPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SubHeader02 />
        </div>
        <div>
            < GetAllAgendamentosSemanaForm />
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default GetAllAgendamentosSemanaPage;
