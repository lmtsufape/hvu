import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";

function MainScreenSecretario() {
    const router = useRouter();
    const [roles, setRoles] = useState([]);

    console.log("Roles:", roles);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setRoles(storedRoles || []);
        }
    }, []);

    if (!roles.length) {
        <div>Carregando dados do usuário...</div>; 
    }

    if (!roles.includes("secretario")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button className={styles.button} onClick={() => router.push('/agendamentosDia')}>
                    <Image src="/calendar.svg" alt="Calendário" width={62} height={62} />
                    <h6>Gerenciar agendamentos</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/pacientesBySecretario')}>
                    <Image src="/subtract.svg" alt="Listagem de pacientes" width={62} height={62} />
                    <h6>Listagem de pacientes</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/getAllMedicos')}>
                    <Image src="/description.svg" alt="Listagem de veterinários" width={62} height={62} />
                    <h6>Listagem de Veterinários&#40;as&#41;</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/gerenciarAgendas')}>
                    <Image src="/overview.svg" alt="Gerenciar agendas" width={62} height={62} />
                    <h6>Gerenciar agendas</h6>
                </button>
            </div>

            <div className={styles.box_button}>
                <button className={styles.button} onClick={() => router.push('/gerenciarRacas')}>
                    <Image src="/pets.svg" alt="Gerenciar raças" width={62} height={62} />
                    <h6>Gerenciar raças</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/gerenciarEspecies')}>
                    <Image src="/especies.svg" alt="Gerenciar espécies" width={62} height={62} />
                    <h6>Gerenciar espécies</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/gerenciarEspecialidades')}>
                    <Image src="/clinical_notes.svg" alt="Gerenciar especialidades" width={62} height={62} />
                    <h6>Gerenciar especialidades</h6>
                </button>
                <button className={styles.button} onClick={() => router.push('/gerenciarTiposConsulta')}>
                    <Image src="/stethoscope.svg" alt="Gerenciar tipos de consulta" width={62} height={62} />
                    <h6>Gerenciar tipos de consulta</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenSecretario;
