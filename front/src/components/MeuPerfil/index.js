import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../VoltarButton";
import { getUsuarioById } from "../../../services/userService";

function MeuPerfilList() {
    const router = useRouter();
    const { id } = router.query;
    const [usuario, setUsuario] = useState({});
    const [token, setToken] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            setToken(storedToken || "");
        }
      }, []);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const usuarioData = await getUsuarioById(id);
                    setUsuario(usuarioData);
                    setErro("");
                } catch (error) {
                    if (error.response.status === 404) {
                        setErro("Página não encontrada (Erro 404)");
                    } else if (error.response.status === 403) {
                        setErro("Acesso negado (Erro 403)");
                    } else {
                        setErro("Erro ao buscar perfil");
                    }
                    console.error('Erro ao buscar usuário:', error);
                }
            };
            fetchData();
        }
    }, [id]);

    if (erro) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Você não tem permissão para acessar esta página.</h3>
            </div>
        );
    }

    if (!token || erro) {
        return (
            <div className={styles.container}>
                <h3 className={styles.message}>Acesso negado: Faça login para acessar esta página.</h3>
            </div>
        );
    }

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

                                    <div className={styles.item_box}>
                                        <h6>CPF</h6>
                                        <div>{usuario.cpf}</div>
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
                                        <div className={styles.item_box}>
                                            <h6>Número</h6>
                                            <div>{usuario.endereco.numero}</div>
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
                                        <div className={styles.item_box}>
                                            <h6>Estado</h6>
                                            <div>{usuario.endereco.estado}</div>
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
