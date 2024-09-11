import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './VisualizarTutor.module.css'; 
import VoltarButton from '@/components/Lapa/VoltarButton';
import { getTutorById } from '../../../../../../services/tutorService'; 

const VisualizarTutor = () => {
    const router = useRouter();
    const { id } = router.query;
    const [tutor, setTutor] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const tutorData = await getTutorById(id);
                    setTutor(tutorData);
                } catch (error) {
                    console.error('Erro ao buscar tutor:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Detalhes do Tutor</h1>
            
            {tutor ? (
                <div className={styles.infoContainer}>
                    <div className={styles.infoBox}>
                        <h6>Nome</h6>
                        <p>{tutor.nome}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>CPF</h6>
                        <p>{tutor.cpf}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>Email</h6>
                        <p>{tutor.email}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>Telefone</h6>
                        <p>{tutor.telefone}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>RG</h6>
                        <p>{tutor.rg}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>Endereço</h6>
                        <p>{tutor.endereco.rua}, {tutor.endereco.numero}, {tutor.endereco.bairro}</p>
                        <p>{tutor.endereco.cidade} - {tutor.endereco.estado}</p>
                        <p>CEP: {tutor.endereco.cep}</p>
                    </div>
                </div>
            ) : (
                <p>Dados do tutor não disponíveis.</p>
            )}

        </div>
    );
};

export default VisualizarTutor;
