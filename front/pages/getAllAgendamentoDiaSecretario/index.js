import React from 'react';
import {Header03} from "../../src/components/Header";
import {SubHeader02} from "../../src/components/SubHeader";
import AgendamentosDoDia from "../../src/components/GetAllAgendamentoSecretarioForm/dia";
import Footer from "../../src/components/Footer";

function AgendamentosDoDiaPage() {
    return (
        <>
        <div>
            < Header03 />
        </div>
        <div>
            < SubHeader02 />
        </div>
        <div>
            < AgendamentosDoDia />
        </div>
        <div>
            < Footer />
        </div>
        </>
    );
}

export default AgendamentosDoDiaPage