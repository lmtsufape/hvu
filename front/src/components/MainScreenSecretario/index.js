import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";

function MainScreenSecretario() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button className={styles.button} onClick={(e) => router.push('/agendamentosDia')}>
                    <Image src="/calendar.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Gerenciar agendamentos</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push('/gerenciarRacas')}>
                    <Image src="/pets.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Gerenciar raças</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push('/pacientes')}>
                    <Image src="/subtract.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Pacientes</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push('/getAllMedicos')}>
                    <Image src="/description.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Listagem de Veterinários&#40;as&#41;</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenSecretario;
