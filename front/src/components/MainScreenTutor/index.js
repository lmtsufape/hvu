import {React, useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";

function MainScreenTutor() {
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

    if (!roles.includes("tutor")) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.box_button}>
                <button className={styles.button} onClick={(e) => router.push("/meusAnimais")}>
                    <Image src="/pets.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Meus animais</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push("/meusAgendamentos")}>
                    <Image src="/calendar.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Meus agendamentos</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenTutor;
