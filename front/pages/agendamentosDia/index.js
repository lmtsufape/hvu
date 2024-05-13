import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader} from "../../src/components/SubHeader";
import GetAllAgendamentosDiaForm from "../../src/components/GetAllAgendamentoDiaForm";
import Footer from "../../src/components/Footer";

function GetAllAgendamentosDiaPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SubHeader />
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