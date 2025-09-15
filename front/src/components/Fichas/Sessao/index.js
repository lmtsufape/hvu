import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import VoltarButton from "../../VoltarButton";
import { CancelarWhiteButton } from "../../WhiteButton";
import { getCurrentUsuario } from '../../../../services/userService';
import { getAnimalById } from '../../../../services/animalService';
import { createFicha } from '../../../../services/fichaService';
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import FinalizarFichaModal from "../FinalizarFichaModal";
import { getTutorByAnimal } from "../../../../services/tutorService";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function FichaSessao() {

    const formBoxRef = useRef(null);
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
    const [agendamentoId, setAgendamentoId] = useState(null);
     

    const [formData, setFormData] = useState({
        numeroSessao: "",
        sessaoData: "",
        anotacao: "",
        estagiario: "",
        rg: ""
    });

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("fichaSessaoFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []); 

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("fichaSessaoFormData", JSON.stringify(formData));
        }
    }, [formData]); 

    // Obtém o ID da ficha da URL
    useEffect(() => {
    if (router.isReady) {
        const id = router.query.fichaId;
        const animalId = router.query.animalId;
        const aId = router.query.agendamentoId; // Obtém o ID do agendamento da URL
        if (id) {
            setConsultaId(id); // Armazena o ID da consulta
        }
        if (aId) {
            setAgendamentoId(aId); // Armazena o ID do agendamento
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
                setUserId(userData.usuario.id);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            } finally {
                setLoading(false); // Marcar como carregado após buscar os dados
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (router.isReady) {
        const medicoFromQuery = router.query.medico;
        if (medicoFromQuery) {
          const nomeMedico = decodeURIComponent(medicoFromQuery);
        
          // ATUALIZA o formData com o nome do médico vindo da URL.
          setFormData(prevData => ({
            ...prevData,
            medicosResponsaveis: nomeMedico 
          }));
          }
       }
            }, [router.isReady, router.query.medico]);

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

    const cleanLocalStorage = () => {
        localStorage.removeItem("fichaSessaoFormData");
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (nomeDoMedicoResponsavel) => {
    const finalFormData = { ...formData, medicosResponsaveis: nomeDoMedicoResponsavel };
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss"); // Gera a data atual no formato ISO 8601
        const fichaData = {
            nome: "Ficha de sessão", 
            conteudo:{
                numeroSessao: formData.numeroSessao,
                sessaoData: formData.sessaoData,
                anotacao: formData.anotacao,
                rg: formData.rg,
                estagiario: formData.estagiario,
                medicosResponsaveis: formData.medicosResponsaveis,
            },
            dataHora: dataFormatada,
            agendamento: {
                id: Number(agendamentoId)
            }
        };

        try {
            console.log(fichaData)
            const resultado = await createFicha(fichaData);
            console.log("Resposta da api", resultado.id);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("fichaSessaoFormData");
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

 

const handleGeneratePDF = () => {
    const input = formBoxRef.current;

    if (!input) {
        console.error("Erro: a referência ao elemento do formulário não foi encontrada.");
        alert("Erro ao gerar PDF: O conteúdo da ficha não foi encontrado.");
        return;
    }

    const actionsBox = input.querySelector(`.${styles.button_box}`);
    
    // 1. Oculta os botões antes da captura
    if (actionsBox) {
        actionsBox.style.visibility = 'hidden';
    }

    // Opções aprimoradas para o html2canvas
    const canvasOptions = {
        // AUMENTA A RESOLUÇÃO DA CAPTURA (MELHORIA MAIS IMPORTANTE)
        scale: 3, 
        useCORS: true,
        allowTaint: true,
        // Garante que o fundo seja branco, evitando problemas com transparência
        backgroundColor: '#ffffff', 
        // Melhora a renderização das fontes
        letterRendering: 1, 
        logging: false // Desative para produção para não poluir o console
    };

    html2canvas(input, canvasOptions).then(canvas => {
        // 2. Reexibe os botões imediatamente após a captura
        if (actionsBox) {
            actionsBox.style.visibility = 'visible';
        }

        // Dados da imagem com alta qualidade
        const imgData = canvas.toDataURL('image/jpeg', 1.0); // Usar JPEG com qualidade máxima

        // Configurações do PDF
        const pdf = new jsPDF({
            orientation: 'p', // p = portrait (retrato)
            unit: 'mm',       // unidade em milímetros
            format: 'a4'      // formato A4
        });

        // Dimensões do PDF e da imagem
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Calcula a proporção para que a imagem se ajuste à largura do PDF
        const ratio = canvasWidth / canvasHeight;
        const imgHeight = pdfWidth / ratio;

        // Lógica para dividir o conteúdo em várias páginas
        let heightLeft = imgHeight;
        let position = 0;

        // Adiciona a primeira parte da imagem
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;

        // Adiciona novas páginas enquanto houver conteúdo restante
        while (heightLeft > 0) {
            position = -heightLeft; // A posição Y da imagem será negativa
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }
        
        // Salva o PDF com um nome de arquivo descritivo
        pdf.save(`solicitacao_exame_${animal.nome || 'animal'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);

    }).catch(err => {
        console.error("Erro crítico no html2canvas:", err);
        if (actionsBox) {
            actionsBox.style.visibility = 'visible';
        }
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console para mais detalhes.");
    });
};
    
    return(
         <div className={styles.container}>
            <VoltarButton />
            <h1>Ficha de Sessão</h1>
            <div className={styles.form_box} ref={formBoxRef}>
                <form onSubmit = {handleSubmit}>
                    <div id="flex-grid" className={styles.column}>
                        <div id="flex-column" className={styles.column}>
                            <label>Sessão nº:</label>
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
                        Anotação
                    </div>
                    <div className={styles.column}>
                        <textarea id="caixa-alta" name="anotacao" value={formData.anotacao} onChange={handleChange} rows="10" cols="50" />
                    </div>              

                    <div className={styles.column}>
                        <label>Estagiário: </label>
                        <input type="text" name="estagiario" value={formData.estagiario} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>RG: </label>
                        <input type="text" name="rg" value={formData.rg} onChange={handleChange} />
                    </div>
                    <div className={styles.column}>
                        <label>Médico(s) Vetérinario(s) Responsável: </label>
                        <input
                            type="text"
                            name="medicosResponsaveis"
                            value={formData.medicosResponsaveis || ''} 
                            readOnly
                            className="form-control"
                            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                            />
                    </div>

                    <div className={styles.button_box}>
                        < CancelarWhiteButton onClick={cleanLocalStorage}/>
                        <button type="button" onClick={handleGeneratePDF} className={styles.pdf_button}>
                            Gerar PDF
                        </button>
                        < FinalizarFichaModal onConfirm={handleSubmit} />
                    </div>
                </form>
                {showAlert && consultaId && (
                <Alert message="Ficha criada com sucesso!" show={showAlert} url={`/createConsulta/${consultaId}`} />
                )}
                {showErrorAlert && (<ErrorAlert message="Erro ao criar ficha" show={showErrorAlert} />)}
            </div>
        </div>

    )
}

export default FichaSessao;