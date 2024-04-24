import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { getUsuarioById } from "../../../services/userService";

function MeuPerfilList() {
    const router = useRouter();
    const { id } = router.query;
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const usuarioData = await getUsuarioById(id);
                    setUsuario(usuarioData);
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    const handleEditarClick = (UsuarioId) => {
        router.push(`/updateMeuPerfil/${UsuarioId}`);
    };

    return (
        <div className={styles.container}>
            < VoltarButton />
            <h1>Meu perfil</h1> 
            
            <div className={styles.container_box}>
                <ul>
                    {usuario && (
                    <div className={styles.list_container}>
                        <li key={usuario.id} className={styles.list_box}>
                            <div className={styles.tutor}>
                                <div className={styles.item_box}>
                                    <h6>Nome</h6>
                                    <div>{usuario.nome}</div>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>E-mail</h6>
                                        <div>{usuario.email}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>Telefone</h6>
                                        <div>{usuario.telefone}</div>
                                    </div>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>CPF</h6>
                                        <div>{usuario.cpf}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>RG</h6>
                                        <div>{usuario.rg}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.title_endereco}>Endereço</div> 

                            {usuario.endereco && (
                                <div className={styles.tutor}>
                                    <div className={styles.item_container}> 
                                        <div  className={styles.item_box}>
                                            <h6>Rua</h6>
                                            <div>{usuario.endereco.rua}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Bairro</h6>
                                            <div>{usuario.endereco.bairro}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>Número</h6>
                                            <div>{usuario.endereco.numero}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Estado</h6>
                                            <div>{usuario.endereco.estado}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>CEP</h6>
                                            <div>{usuario.endereco.cep}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Cidade</h6>
                                            <div>{usuario.endereco.cidade}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    </div>
                    )}
                </ul>
                <div className={styles.botao}>
                    <button className={styles.editar_button} onClick={() => handleEditarClick(usuario.id)}>
                        Editar 
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MeuPerfilList;
