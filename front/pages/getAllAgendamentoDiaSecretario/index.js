import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import GetAllAgendamentosDiaForm from "../../src/components/GetAllAgendamentoDiaForm";
import Footer from "../../src/components/Footer";

function GetAllAgendamentosDiaPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SubHeader02 />
        </div>
        <div>
            < GetAllAgendamentosDiaForm />
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default GetAllAgendamentosDiaPage;