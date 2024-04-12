import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { getMedicoById } from '../../../services/medicoService';
import { VisualizarAgendaWhiteButton } from '../WhiteButton';

function GetMedicoById() {
    const router = useRouter();
    const { id } = router.query;
    const [medico, setMedico] = useState({});

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const medicoData = await getMedicoById(id);
                    setMedico(medicoData);
                } catch (error) {
                    console.error('Erro ao buscar veterinários(as):', error);
                }
            };
            fetchData();
        }
    }, [id]);

    return (
        <div className={styles.container}>
            < VoltarButton />
            <h1>Informações do&#40;a&#41; veterinário&#40;a&#41;</h1> 
            
            <div className={styles.container_box}>
                <ul>
                    {medico && (
                    <div className={styles.list_container}>
                        <li key={medico.id} className={styles.list_box}>
                            <div className={styles.tutor}>
                                <div className={styles.item_box}>
                                    <h6>Nome</h6>
                                    <div>{medico.nome}</div>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>E-mail</h6>
                                        <div>{medico.email}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>Telefone</h6>
                                        <div>{medico.telefone}</div>
                                    </div>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>CPF</h6>
                                        <div>{medico.cpf}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>CRMV</h6>
                                        <div>{medico.crmv}</div>
                                    </div>
                                </div>
                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>Especialidade</h6>
                                        <div>
                                            {medico.especialidade && medico.especialidade.map((especialidade, index) => (
                                                <span key={index}>
                                                    {especialidade.nome}
                                                    {index !== medico.especialidade.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <div className={styles.title_endereco}>Endereço</div> 

                            {medico.endereco && (
                                <div className={styles.tutor}>
                                    <div className={styles.item_container}> 
                                        <div  className={styles.item_box}>
                                            <h6>Rua</h6>
                                            <div>{medico.endereco.rua}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Bairro</h6>
                                            <div>{medico.endereco.bairro}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>Número</h6>
                                            <div>{medico.endereco.numero}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Estado</h6>
                                            <div>{medico.endereco.estado}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>CEP</h6>
                                            <div>{medico.endereco.cep}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Cidade</h6>
                                            <div>{medico.endereco.cidade}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    </div>
                    )}
                </ul>
                <div className={styles.button_container}>
                    <button className={styles.editar_button} onClick={() => router.push(`/updateMedico/${medico.id}`)}>
                        Editar 
                    </button>
                    <VisualizarAgendaWhiteButton/>
                </div>
            </div>
        </div>
    );
}

export default GetMedicoById;
