import React from 'react';
import {Header03} from "../src/components/Header/header";
import {SegundaHeader02} from "../src/components/AnotherHeader/anotherHeader";
import AgendamentosDaSemana from "../src/components/ConsultarAgendamentosSecretario/semana";
import Footer from "../src/components/Footer/Footer";

function AgendamentosDaSemanaPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SegundaHeader02 />
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