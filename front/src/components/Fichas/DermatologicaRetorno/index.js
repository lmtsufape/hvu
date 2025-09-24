import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import { createFicha } from '../../../../services/fichaService';
import FinalizarFichaModal from "../FinalizarFichaModal";
import moment from 'moment';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getAnimalById } from "../../../../services/animalService";
import { getMedicoById } from "../../../../services/medicoService";

function FichaDermatologicaRetorno() {

    const [userId, setUserId] = useState(null);
    console.log("userId:", userId);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [mostrarExames, setMostrarExames] = useState(false);
    const [consultaId, setConsultaId] = useState(null);
    const router = useRouter();

    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor , setTutor] = useState({});
    const [agendamentoId, setAgendamentoId] = useState(null);
    const [medicoLogado, setMedicoLogado] = useState(null);
    const [formData, setFormData] = useState({
        anamnese: "",
        tratamentos: "",
        resultados: "",
        locaisAfetados: "",
        condutaTerapeutica: "",
        estagiarios: "",
        peso: "",
        medicoResponsavel: "",
    });

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("fichaCardiologicaFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []); 

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("fichaCardiologicaFormData", JSON.stringify(formData));
        }
    }, [formData]); 

    // Obtém o ID da ficha da URL
   useEffect(() => {
      if (router.isReady) {
          const id = router.query.fichaId;
          const animalId = router.query.animalId;
           const aId = router.query.agendamentoId; // Obtém o ID do agendamento da URL
          if (id) {
          setConsultaId(id);
          }
          if (aId) {
              setAgendamentoId(aId); // Define o ID do agendamento
          }

          if (animalId) {
              setAnimalId(animalId);
          }
      }
      }, [router.isReady, router.query.fichaId]);

    useEffect(() => {
    if (!animalId) return;

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
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [animalId]);

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
                const medicoId = userData.usuario.id;
                setMedicoLogado(userData.usuario); 
                if (medicoId) {
                const medicoCompletoData = await getMedicoById(medicoId);
                //Armazena o objeto COMPLETO (que tem o CRMV) no estado
                setMedicoLogado(medicoCompletoData);
                console.log("Dados completos do médico logado:", medicoCompletoData);
                }
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className={styles.message}>Carregando dados do usuário...</div>;
    }

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


    const handleSubmit = async (event) => {
        event?.preventDefault(); // Usa encadeamento opcional para evitar erro
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); 
        const fichaData = {
            nome: "Ficha dermatológica de retorno",  
            conteudo:{
                anamnese: formData.anamnese,
                tratamentos: formData.tratamentos,
                resultados: formData.resultados,
                locaisAfetados: formData.locaisAfetados,
                condutaTerapeutica: formData.condutaTerapeutica,
                estagiarios: formData.estagiarios,
                peso: formData.peso,
                medicoResponsavel: formData.medicoResponsavel,
                
            },
            dataHora: dataFormatada,
            agendamento: {
                id: Number(agendamentoId)
            }
        };

        try {
            const resultado = await createFicha(fichaData);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("fichaCardiologicaFormData");
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const cleanLocalStorage = () => {
        localStorage.removeItem("fichaCardiologicaFormData");
    }

    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha Clínica Dermatológica de Retorno </h1>
            <div className={styles.form_box}>
                <form onSubmit={handleSubmit}>
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
                        Anamnese
                    </div>
                    <div className={styles.column}>
                    <div id="flex-column" className={styles.column}>
                        <label>peso:</label>
                        <input id="meia-caixa" type="text" name="peso" 
                        value={formData.peso} 
                        onChange={handleChange} />
                    </div>
                    </div>

                    <div className={styles.column}>
                        <label>Anamnese/Histórico clínico </label>
                        <textarea name="anamnese" value={formData.anamnese} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>
                    <div className={styles.column}>
                        <label>Tratamentos realizados (Início/Término/Resposta terapêutica) </label>
                        <textarea name="tratamentos" value={formData.tratamentos} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>
                    <div className={styles.column}>
                        <label>Resultados dos exames realizados </label>
                        <textarea name="resultados" value={formData.resultados} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>

                    <div className={styles.titulo}>
                        Exame físico dermatológico/Descrição lesional
                    </div>

                    <div className={styles.column}>
                        <label>Locais afetados </label>
                        <textarea name="locaisAfetados" value={formData.locaisAfetados} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>
                    <div className={styles.column}>
                        <label>Conduta terapêutica </label>
                        <textarea name="condutaTerapeutica" value={formData.condutaTerapeutica} 
                        onChange={handleChange} rows="4" cols="50" />
                    </div>
                    
                    <div className={styles.column}>
                        <label>Plantonista(s) discente(s): </label>
                        <textarea name="estagiarios" value={formData.estagiarios} 
                        onChange={handleChange} />
                    </div>

                    <div className={styles.assinaturaSombreada}>
                            {medicoLogado ? (
                            <p style={{ margin: 0 }}>
                                Assinado eletronicamente por <strong>Dr(a). {medicoLogado.nome}</strong>, CRMV {medicoLogado.crmv}
                            </p>
                        ) : (
                            <p style={{ margin: 0 }}>Carregando dados do médico...</p>
                        )}
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage}/>
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
                {showAlert && consultaId &&
                <div className={styles.alert}>
                    <Alert message="Ficha criada com sucesso!" 
                    show={showAlert} url={`/createConsulta/${consultaId}`} />
                </div>}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default FichaDermatologicaRetorno;