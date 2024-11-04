import {React, useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./index.module.css";
import { getCurrentUsuario } from '../../../services/userService';

function MainScreenMedico() {
    const router = useRouter();

    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedRoles = JSON.parse(localStorage.getItem('roles'));
            setToken(storedToken || "");
            setRoles(storedRoles || []);
        }
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await getCurrentUsuario();
                setUserId(userData.usuario.id);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, []);

    // Verifica se os dados estão carregando
    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    // Verifica se o usuário tem permissão
    if (!roles.includes("medico")) {
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
                <button className={styles.button} onClick={(e) => router.push(`/agendamentosByMedico/${userId}`)}>
                    <Image src="/calendar.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Consultar agendamentos</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push(`/pacientesByMedico/${userId}`)}>
                    <Image src="/subtract.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Meus pacientes</h6>
                </button>
                <button className={styles.button} onClick={(e) => router.push(`/getAllCronogramaByMedico/${userId}`)}>
                    <Image src="/description.svg" alt="Calendário" width={62} height={62}/>
                    <h6>Minhas agendas</h6>
                </button>
            </div>
        </div>
    );
}

export default MainScreenMedico;
