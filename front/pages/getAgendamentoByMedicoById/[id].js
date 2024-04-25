import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import GetAgendamentoByMedicoById from "../../src/components/GetAgendamentoByMedicoById";
import Footer from "../../src/components/Footer";

function GetAgendamentoByMedicoByIdPage() {
    return (
        <div>
            < Header03 />
            < SubHeader02 />
            < GetAgendamentoByMedicoById />
            < Footer />
        </div>
    );
}

export default GetAgendamentoByMedicoByIdPage;