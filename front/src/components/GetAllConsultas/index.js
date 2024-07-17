import React, { useState, useEffect } from 'react';
import styles from "./index.module.css";
import { useRouter } from "next/router";
import VoltarButton from "../VoltarButton";
import SearchBar from "../SearchBar";
import { getConsultaByAnimal } from '../../../services/consultaService';
import { CriarConsulta } from '../WhiteButton';

function GetAllConsultas() {
    const router = useRouter();
    const { id } = router.query;

    const [consultas, setConsultas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const consultasData = await getConsultaByAnimal(id);
                setConsultas(consultasData);
            } catch (error) {
                console.error('Erro ao buscar consultas:', error);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    return (
        <div>
            <div className={styles.voltar}>
                <VoltarButton />
            </div>
            <div className={styles.titleMeusAgendamentos}>
                <h1>Histórico de consultas</h1>
            </div>
            <div className={styles.navbar}>
                <SearchBar
                    placeholder="Buscar consulta através do nome do(a) veterinário(a)"
                    onSearchChange={handleSearchChange}
                />
                <CriarConsulta page={'createConsulta'} id={id} />
            </div>

            {consultas.length === 0 ? (
                <div className={styles.message}>Não há consultas registradas para este animal.</div>
            ) : (
                <ul className={styles.list}>
                    {consultas.map(consulta => (
                        <li key={consulta.id} className={styles.info_container}>
                            <div className={styles.agendamentos}>
                                <div className={styles.agendamentoBox}>
                                    <div>
                                        <h1>Consulta Clínica</h1>
                                        <h2>{consulta.animal && consulta.animal.nome}</h2>
                                    </div>
                                    <div>
                                        <h1>Veterinário&#40;a&#41;</h1>
                                        <h2>{consulta.medico.nome}</h2>
                                    </div>
                                    <div> 
                                        <button className={styles.acessar_button} onClick={() => router.push(`/getConsultaById/${consulta.id}`)}>
                                            Visualizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default GetAllConsultas;
