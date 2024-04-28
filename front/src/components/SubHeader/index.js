import {React, useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css"
import { useRouter } from "next/router";
import { getCurrentUsuario } from '../../../services/userService';

//Sem botão de relatório
export function SubHeader01 () {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/mainTutor")}>Home</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAgendamentos")}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={(e) => router.push("/meusAnimais")}>Meus animais</button>
        </div>
    );
}

//Com botão de relatório
export function SubHeader02() {
    const [subHeaderComponent, setSubHeaderComponent] = useState(null);

    const loadSubHeaderComponent = async () => {
        try {
            const userData = await getCurrentUsuario();

            console.log("user:", userData)

            if (userData.roles && Array.isArray(userData.roles)) {
                if (userData.roles.includes("secretario")) {
                    setSubHeaderComponent(<SubheaderSecretario />);
                } else if (userData.roles.includes("medico")) {
                    setSubHeaderComponent(<SubheaderMedico medicoId={userData.usuario.id} />);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadSubHeaderComponent();
    }, []); 

    return (
        <div>
            {subHeaderComponent}
        </div>
    );
}

export function SubheaderSecretario() {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/mainSecretario')}>Home</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/agendamentosDia')}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/gerenciarRacas')}>Raças</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/pacientesBySecretario')}>Pacientes</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/getAllMedicos')}>Veterinários&#40;as&#41;</button>
        </div>
    );
}

export function SubheaderMedico({medicoId}) {
    const router = useRouter();

    return (
        <div className={styles.button_box}>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push('/mainMedico')}>Home</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push(`/agendamentosByMedico/${medicoId}`)}>Agendamentos</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push(`/pacientesByMedico/${medicoId}`)}>Pacientes</button>
            <button type="button" className="btn btn-link" id={styles.button_decoration} onClick={() => router.push(`/getAllCronogramaByMedico/${medicoId}`)}>Agendas</button>
        </div>
    );
}

