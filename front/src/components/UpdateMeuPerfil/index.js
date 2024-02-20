import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { getTutorById } from "../../../services/tutorService";

function UpdateMeuPerfilForm() {
    const router = useRouter();
    const { id } = router.query;
    const [tutor, setTutor] = useState({});

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

    return(
        <div className={styles.container}>
            < VoltarButton />
            <h1>Editar Perfil</h1> 
            
            <div className={styles.container_box}>
                <ul>
                    {tutor && (
                    <div className={styles.list_container}>
                        <li key={tutor.id} className={styles.list_box}>
                            <div className={styles.tutor}>
                                <div className={styles.item_box}>
                                    <h6>Nome</h6>
                                    <div>{tutor.nome}</div>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>E-mail</h6>
                                        <div>{tutor.email}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>Telefone</h6>
                                        <div>{tutor.telefone}</div>
                                    </div>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>CPF</h6>
                                        <div>{tutor.cpf}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>RG</h6>
                                        <div>{tutor.rg}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.title_endereco}>Endereço</div> 

                            {tutor.endereco && (
                                <div className={styles.tutor}>
                                    <div className={styles.item_container}> 
                                        <div  className={styles.item_box}>
                                            <h6>Rua</h6>
                                            <div>{tutor.endereco.rua}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Bairro</h6>
                                            <div>{tutor.endereco.bairro}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>Número</h6>
                                            <div>{tutor.endereco.numero}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Estado</h6>
                                            <div>{tutor.endereco.estado}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>CEP</h6>
                                            <div>{tutor.endereco.cep}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Cidade</h6>
                                            <div>{tutor.endereco.cidade}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    </div>
                    )}
                </ul>
                <div className={styles.botao}>
                    <button className={styles.editar_button} onClick={() => handleEditarClick(tutor.id)}>
                        Editar 
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpdateMeuPerfilForm;
