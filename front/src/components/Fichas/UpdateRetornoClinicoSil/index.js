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

function updateFichaRetornoClinicoSil() {

    const [userId, setUserId] = useState(null);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const [consultaId, setConsultaId] = useState(null);
    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [tutor , setTutor] = useState({});
    const [fichaId, setFichaId] = useState(null);
    const [data, setData] = useState([]);
     

    const [formData, setFormData] = useState({
        numeroSessao: "",
        sessaoData: "",
        anamnese: "",
        exameclinico: "",
        tratamento: "",
        exames: [],
        rg: "",
        estagiario: "",
        medicoresponsavel: "",
        outros_texto: ""
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
            nome: "Ficha de Retorno Clínico de Animais Silvestres e Exóticos",  
            conteudo:{
                numeroSessao: formData.numeroSessao,
                sessaoData: formData.sessaoData,
                anamnese: formData.anamnese,
                exameclinico: formData.exameclinico,
                tratamento: formData.tratamento,
                exames: formData.exames,
                rg: formData.rg,
                estagiario: formData.estagiario,
                medicoresponsavel: formData.medicoresponsavel,
                outros_texto: formData.outros_texto
            },
            dataHora: dataFormatada 
        };

        try {
            await updateFicha(fichaData, fichaId);
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao editar ficha:", error);
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

    const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData(prevState => {
        const examesAtual = Array.isArray(prevState.exames) ? prevState.exames : [];
        const exames = checked
            ? [...examesAtual, value]
            : examesAtual.filter(item => item !== value);
        return { ...prevState, exames };
    });
};


    
    return(
        <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha clínico médica de retorno de animais silvestres e exóticos</h1>
            <div className={styles.form_box}>
                <form onSubmit = {handleSubmit}>
                    <div id="flex-grid" className={styles.column}>
                        <div id="flex-column" className={styles.column}>
                            <label>RG:</label>
                            <input id="meia-caixa" type="text" name="numeroSessao" 
                            value={formData.numeroSessao} 
                            onChange={handleChange} />
                        </div>
                        <div id="flex-column" className={styles.column}>
                            <label>Data:</label>
                            <input id="meia-caixa" type="date" name="sessaoData" 
                            value={formData.sessaoData} 
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
                        Retorno – Acompanhamento Clínico
                    </div>
                    <div className={styles.column}>
                        <label>Anamnese:</label>
                        <textarea id="text" name="anamnese" value={formData.anamnese} onChange={handleChange} rows="10" cols="50" />
                    </div>

                    <div className={styles.column}>
                        <label>Exame Clínico:</label>
                        <textarea id="text" name="exameclinico" value={formData.exameclinico} onChange={handleChange} rows="10" cols="50" />
                    </div>

                    <div className={styles.column}>
                        <label>Tratamento:</label>
                        <textarea id="text" name="tratamento" value={formData.tratamento} onChange={handleChange} rows="10" cols="50" />
                    </div>

                    <div className={styles.titulo}>
                        Exames Complementares
                    </div>

                    <div className={styles.checkbox_container}>
                    <div>
                        <label><input type="checkbox" name="exames" value="hemograma" onChange={handleCheckboxChange} /> Hemograma</label>
                        <label><input type="checkbox" name="exames" value="alt_tgp" onChange={handleCheckboxChange} /> ALT/TGP</label>
                        <label><input type="checkbox" name="exames" value="ast_tgo" onChange={handleCheckboxChange} /> AST/TGO</label>
                        <label><input type="checkbox" name="exames" value="creatinina" onChange={handleCheckboxChange} /> Creatinina</label>
                        <label><input type="checkbox" name="exames" value="ureia" onChange={handleCheckboxChange} /> Uréia</label>
                    </div>

                    <div>
                        <label><input type="checkbox" name="exames" value="proteinas_totais" onChange={handleCheckboxChange} /> Proteínas Totais</label>
                        <label><input type="checkbox" name="exames" value="albumina" onChange={handleCheckboxChange} /> Albumina</label>
                        <label><input type="checkbox" name="exames" value="globulina" onChange={handleCheckboxChange} /> Globulina</label>
                        <label><input type="checkbox" name="exames" value="fa" onChange={handleCheckboxChange} /> FA</label>
                        <label><input type="checkbox" name="exames" value="ggt" onChange={handleCheckboxChange} /> GGT</label>
                    </div>

                    <div>
                        <label><input type="checkbox" name="exames" value="glicose" onChange={handleCheckboxChange} /> Glicose</label>
                        <label><input type="checkbox" name="exames" value="triglicerides" onChange={handleCheckboxChange} /> Triglicerídes</label>
                        <label><input type="checkbox" name="exames" value="colesterol_total" onChange={handleCheckboxChange} /> Colesterol Total</label>
                        <label><input type="checkbox" name="exames" value="urinalise" onChange={handleCheckboxChange} /> Urinálise</label>
                    </div>

                    <div>
                        <label><input type="checkbox" name="exames" value="bilirrubina_total" onChange={handleCheckboxChange} /> Bilirrubina Total e Frações</label>
                        <label><input type="checkbox" name="exames" value="tricograma" onChange={handleCheckboxChange} /> Tricograma</label>
                        <label><input type="checkbox" name="exames" value="citologia_cutanea" onChange={handleCheckboxChange} /> Citologia Cutânea</label>
                    </div>

                    <div>
                        <label><input type="checkbox" name="exames" value="raspado_cutaneo" onChange={handleCheckboxChange} /> Raspado Cutâneo</label>
                        <label><input type="checkbox" name="exames" value="citologia_oncologica" onChange={handleCheckboxChange} /> Citologia Oncológica</label>
                        <label><input type="checkbox" name="exames" value="histopatologico" onChange={handleCheckboxChange} /> Histopatológico</label>
                    </div>

                    <div>
                        <label><input type="checkbox" name="exames" value="ultrassonografia" onChange={handleCheckboxChange} /> Ultrassonografia</label>
                        <label><input type="checkbox" name="exames" value="raio_x" onChange={handleCheckboxChange} /> Raio X</label>
                        <label>
                        <input
                            type="checkbox"
                            name="exames"
                            value="outros"
                            onChange={handleCheckboxChange}
                            checked={formData.exames.includes("outros")}
                        /> Outros:
                        </label>
                        
                        {formData.exames.includes("outros") && (
                        <input
                            type="text"
                            name="outros_texto"
                            value={formData.outros_texto}
                            onChange={handleChange}
                            disabled={!formData.exames.includes("outros")}
                            placeholder="Especifique"
                        />
                        )}
                    </div>
                    </div>

                    <div className={styles.column}>
                        <label>Estagiário: </label>
                        <input type="text" name="estagiario" value={formData.estagiario} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Médico(s) Vetérinario(s) Responsável: </label>
                        <input type="text" name="medicoresponsavel" value={formData.medicoresponsavel} onChange={handleChange} />
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton />
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
                {showAlert && consultaId && (
                <Alert message="Ficha editada com sucesso!" show={showAlert} url={`/createConsulta/${consultaId}`} />
                )}
                {showErrorAlert && (<ErrorAlert message="Erro ao editar ficha" show={showErrorAlert} />)}
            </div>
        </div>
    )
}

export default updateFichaRetornoClinicoSil;