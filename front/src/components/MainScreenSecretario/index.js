import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";

function MainScreenSecretario() {
    const router = useRouter();
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");

    console.log("Roles:", roles);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

    if (!roles.length) {
        <div className={styles.message}>Carregando dados do usuário...</div>; 
    }

    if (!roles.includes("secretario") || !token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    if (!token) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
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

            <div className={styles.box_button}>
                <button className={styles.button} onClick={() => router.push('/gerenciarAvisos')}>
                    <Image src="/images/notifications.png" alt="Gerenciar avisos" width={62} height={62} />
                    <h6>Gerenciar avisos</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenSecretario;
