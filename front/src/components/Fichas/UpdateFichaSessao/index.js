import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import { getAnimalById } from '../../../../services/animalService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import FinalizarFichaModal from "../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";

function updateFichaSessao() {

    const [userId, setUserId] = useState(null);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const { id, modo } = router.query; 
    const [isReadOnly, setIsReadOnly] = useState(false);

    const [consultaId, setConsultaId] = useState(null);
    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [fichaId, setFichaId] = useState(null);
    const [data, setData] = useState([]);
    const [showButtons, setShowButtons] = useState(false);
    const [tutor , setTutor] = useState({});
     

    useEffect(() => {
        // Se o modo for 'visualizar', define o estado para somente leitura
        if (modo === 'visualizar') {
            setIsReadOnly(true);
        }
    }, [modo]);

    const [formData, setFormData] = useState({
        numeroSessao: "",
        sessaoData: "",
        anotacao: "",
        estagiario: "",
        rg: ""
    });

    // Obtém o ID da ficha da URL
    useEffect(() => {
    if (router.isReady) {
        const id = router.query.consultaId;
        const animalId = router.query.animalId;
        const ficha = router.query.fichaId;
        if (id) {
            setConsultaId(id);
        }
        if (animalId) {
            setAnimalId(animalId);
        }
        if (ficha) {
            setFichaId(ficha);
        }
    }
    }, [router.isReady, router.query.consultaId]);

   useEffect(() => {
    if (!animalId) return;
    if (!fichaId) return;

    const fetchData = async () => {
        try {
            const animalData = await getAnimalById(animalId);
            setAnimal(animalData);
        } catch (error) {
            console.error('Erro ao buscar animal:', error);
        }

        try {
            const tutorData = await getTutorByAnimal(animalId);
            setTutor(tutorData);
        } catch (error) {
            console.error('Erro ao buscar tutor do animal:', error);
        } 

        try {
            const formData = await getFichaById(fichaId);
            setFormData(JSON.parse(formData.conteudo));
            setData(formData.dataHora);
        } catch (error) {
            console.error('Erro ao buscar dados da ficha:', error);
        } finally {
            setLoading(false);
        }
    };

        fetchData();
    }, [animalId, fichaId]);


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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss"); 
        const fichaData = {
            nome: "Ficha de sessão",  
            conteudo: {
                numeroSessao: formData.numeroSessao,
                sessaoData: formData.sessaoData,
                anotacao: formData.anotacao,
                rg: formData.rg,
                estagiario: formData.estagiario
            },
            dataHora: dataFormatada // Gera a data atual no formato ISO 8601
        };

        try {
            console.log(fichaData)
            await updateFicha(fichaData, fichaId);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            if (error.response && error.response.data && error.response.data.code) {
                setErrorMessage(error.response.data.message);
            }
            setShowErrorAlert(true);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };
    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de sessão</h1>
            <div className={styles.form_box}>
                <form onSubmit = {handleSubmit}>
                    <div id="flex-grid" className={styles.column}>
                        <div id="flex-column" className={styles.column}>
                            <label>Sessão nº:</label>
                            <input id="meia-caixa" type="text" name="numeroSessao" 
                            value={formData.numeroSessao}
                            disabled={isReadOnly}
                            onChange={handleChange} />
                        </div>
                        <div id="flex-column" className={styles.column}>
                            <label>Data:</label>
                            <input id="meia-caixa" type="date" name="sessaoData" 
                            value={formData.sessaoData} 
                            disabled={isReadOnly}
                            onChange={handleChange}/>
                        </div>
                    </div>

                    <div className={styles.box_ficha_toggle}>
                        <button
                            type="button"
                            className={`${styles.toggleButton} ${showButtons ? styles.minimize : styles.expand}`}
                            onClick={() => setShowButtons(prev => !prev)}
                        >
                            Dados do animal
                        </button>
                        {showButtons && (
                            <div className={styles.container_toggle}>
                                <ul>
                                    {animal && ( 
                                        <li key={animal.id} className={styles.infos_box}>
                                            <div className={styles.identificacao}>
                                                <div className={styles.nome_animal}>{animal.nome}</div>
                                                <div className={styles.especie_animal}>Nome</div>
                                            </div>
                                            <div className={styles.form}>
                                                <div className={styles.box}>
                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Espécie</h6>
                                                            <p>{animal.raca && animal.raca.especie && animal.raca.especie.nome}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Sexo</h6>
                                                            <p>{animal.sexo}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Peso</h6>
                                                            <p>{animal.peso === 0 || animal.peso === '' ? 'Não definido' : animal.peso}</p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Raça</h6>
                                                            <p>{animal.raca && animal.raca.nome}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Porte</h6>
                                                            <p>{animal.raca && animal.raca.porte ? animal.raca && animal.raca.porte : 'Não definido'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Data de nascimento</h6>
                                                            <p>{animal.dataNascimento ? formatDate(animal.dataNascimento) : 'Não definida'}</p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.lista}>
                                                        <div className={styles.infos}>
                                                            <h6>Alergias</h6>
                                                            <p>{animal.alergias ? animal.alergias : 'Não definidas'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Número da ficha</h6>
                                                            <p>{animal.numeroFicha ? animal.numeroFicha : 'Não definido'}</p>
                                                        </div>
                                                        <div className={styles.infos}>
                                                            <h6>Tutor</h6>
                                                            <p>{tutor.nome ? tutor.nome : 'Não definido'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className={styles.titulo}>
                        Anotação
                    </div>
                    <div className={styles.column}>
                        <textarea id="caixa-alta" name="anotacao" value={formData.anotacao} disabled={isReadOnly} onChange={handleChange} rows="10" cols="50" />
                    </div>              

                    <div className={styles.column}>
                        <label>Estagiário: </label>
                        <input type="text" name="estagiario" value={formData.estagiario} disabled={isReadOnly} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>RG: </label>
                        <input type="text" name="rg" value={formData.rg} disabled={isReadOnly} onChange={handleChange} />
                    </div>

                    {!isReadOnly && (
                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                    )}
                </form>
                {showAlert && consultaId && (
                <Alert message="Ficha editada com sucesso!" show={showAlert} url={`/createConsulta/${consultaId}`} />
                )}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default updateFichaSessao;