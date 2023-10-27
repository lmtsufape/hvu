import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from ".//dia.module.css";
import axios from 'axios';
import NovoAgendamentoButton from "./novoAgendamentoButton"

function AgendamentosDoDia () {
    return (
        <>
            < NovoAgendamentoButton />
        </>
    );
}

export default AgendamentosDoDia