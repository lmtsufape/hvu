import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import AgendamentosDaSemana from "../../src/components/GetAllAgendamentoSecretarioForm/semana";
import Footer from "../../src/components/Footer";

function AgendamentosDaSemanaPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SubHeader02 />
        </div>
        <div>
            < AgendamentosDaSemana />
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default AgendamentosDaSemanaPage