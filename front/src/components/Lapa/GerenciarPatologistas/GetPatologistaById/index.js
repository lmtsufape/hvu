import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../../../VoltarButton";
import { getPatologistaById } from "../../../../../services/patologistaService";
import { EditarWhiteButton } from '../../../WhiteButton';

function GetPatologistaById() {
    const router = useRouter();
    const { id } = router.query;
    const [patologista, setPatologista] = useState({});
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
        if (id) {
            const fetchData = async () => {
                try {
                    const patologistaData = await getPatologistaById(id);
                    console.log("patologistaData:", patologistaData)
                    setPatologista(patologistaData);
                } catch (error) {
                    console.error('Erro ao buscar patologistas:', error);
                } finally {
                    setLoading(false); 
                }
            };
            fetchData();
        }
    }, [id]);

    console.log("patologista:", patologista)

    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

    if (!roles.includes("admin_lapa")) {
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
            < VoltarButton />
            <h1>Informações de Patologista</h1> 
            
            <div className={styles.container_box}>
                <ul>
                    {patologista && (
                    <div className={styles.list_container}>
                        <li key={patologista.id} className={styles.list_box}>
                            <div className={styles.tutor}>
                                <div className={styles.item_box}>
                                    <h6>Nome</h6>
                                    <h4 className={styles.medico_nome}>{patologista.nome}</h4>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>E-mail</h6>
                                        <div>{patologista.email}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>Telefone</h6>
                                        <div>{patologista.telefone}</div>
                                    </div>
                                </div>

                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>CPF</h6>
                                        <div>{patologista.cpf}</div>
                                    </div>
                                    <div className={styles.item_box}>
                                        <h6>CRMV</h6>
                                        <div>{patologista.crmv}</div>
                                    </div>
                                </div>
                                <div className={styles.item_container}> 
                                    <div className={styles.item_box}>
                                        <h6>Especialidade</h6>
                                        <div>
                                            {patologista.especialidade && patologista.especialidade.map((especialidade, index) => (
                                                <span key={index}>
                                                    {especialidade.nome}
                                                    {index !== patologista.especialidade.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <div className={styles.title_endereco}>Endereço</div> 

                            {patologista.endereco && (
                                <div className={styles.tutor}>
                                    <div className={styles.item_container}> 
                                        <div  className={styles.item_box}>
                                            <h6>Rua</h6>
                                            <div>{patologista.endereco.rua}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Bairro</h6>
                                            <div>{patologista.endereco.bairro}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>Número</h6>
                                            <div>{patologista.endereco.numero}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Estado</h6>
                                            <div>{patologista.endereco.estado}</div>
                                        </div>
                                    </div>

                                    <div className={styles.item_container}> 
                                        <div className={styles.item_box}>
                                            <h6>CEP</h6>
                                            <div>{patologista.endereco.cep}</div>
                                        </div>
                                        <div className={styles.item_box}>
                                            <h6>Cidade</h6>
                                            <div>{patologista.endereco.cidade}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    </div>
                    )}
                </ul>
                <div className={styles.button_container}>
                    <EditarWhiteButton page={"lapa/gerenciarPatologistas/updatePatologista"} id={patologista.id}/>
                </div>
            </div>
        </div>
    );
}

export default GetPatologistaById;
