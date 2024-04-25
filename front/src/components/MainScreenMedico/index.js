import {React, useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";
import { getCurrentUsuario } from '../../../services/userService';

function MainScreenMedico() {
    const router = useRouter();

    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUsuario();
                setUserId(userData.id);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button className={styles.button} onClick={(e) => router.push(`/agendamentosByMedico/${userId}`)}>
                    <Image src="/calendar.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Consultar agendamentos</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push(`/pacientesByMedico/${userId}`)}>
                    <Image src="/subtract.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Pacientes</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push(`/getAllCronogramaByMedico/${userId}`)}>
                    <Image src="/description.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Agendas</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenMedico;
