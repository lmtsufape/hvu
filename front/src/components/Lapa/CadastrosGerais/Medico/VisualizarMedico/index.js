import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from '@/components/Lapa/VoltarButton';
import { getMedicoById } from '../../../../../../services/medicoService'; 

const VisualizarMedico = () => {
    const router = useRouter();
    const { id } = router.query;
    const [medico, setMedico] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const medicoData = await getMedicoById(id);
                    setMedico(medicoData);
                } catch (error) {
                    console.error('Erro ao buscar médico:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={styles.container}>
            <VoltarButton />
            <h1>Detalhes do Médico</h1>
            
            {medico ? (
                <div className={styles.infoContainer}>
                    <div className={styles.infoBox}>
                        <h6>Nome</h6>
                        <p>{medico.nome}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>CPF</h6>
                        <p>{medico.cpf}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>Email</h6>
                        <p>{medico.email}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>Telefone</h6>
                        <p>{medico.telefone}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>CRM</h6>
                        <p>{medico.crmv}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>Endereço</h6>
                        <p>{medico.endereco.rua}, {medico.endereco.numero}, {medico.endereco.bairro}</p>
                        <p>{medico.endereco.cidade} - {medico.endereco.municipio}</p>
                        <p>CEP: {medico.endereco.cep}</p>
                    </div>
                    <div className={styles.infoBox}>
                        <h6>Especialidade</h6>
                        <p>{medico.especialidade.map(especialidade => especialidade.id).join(', ')}</p>
                    </div>
                </div>
            ) : (
                <p>Dados do médico não disponíveis.</p>
            )}
        </div>
    );
};

export default VisualizarMedico;
