import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "./index.module.css";
import { getConsultaById } from '../../../services/consultaService';
import VoltarButton from '../VoltarButton';
import { EditarWhiteButton } from '../WhiteButton';


// Função para formatar o conteúdo da ficha (COPIADA DO SEU OUTRO ARQUIVO)
const formatFichaContent = (content) => {
    if (!content || typeof content !== 'object') {
        return <p>Sem conteúdo disponível</p>;
    }
    // Se o conteúdo for uma string JSON, precisa ser parseado primeiro.
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;

    return Object.entries(parsedContent).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        if (typeof value === 'object' && value !== null) {
            return (
                <div key={key}>
                    <strong>{formattedKey}:</strong>
                    <div style={{ marginLeft: '20px' }}>{formatFichaContent(value)}</div>
                </div>
            );
        }
        return (
            <p key={key}>
                <strong>{formattedKey}:</strong> {String(value)}
            </p>
        );
    });
};

function GetConsultaById() {
    const router = useRouter();
    const { id } = router.query;
    const [consulta, setConsulta] = useState({});
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    const [showFichas, setShowFichas] = useState(false);
    const [selectedFichaId, setSelectedFichaId] = useState(null);

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
                    const consultaData = await getConsultaById(id);
                    setConsulta(consultaData);
                } catch (error) {
                    console.error('Erro ao buscar consulta:', error);
                } finally {
                    setLoading(false); // Marcar como carregado após buscar os dados
                }
            };
            fetchData();
        }
    }, [id]);

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

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const toggleFichaDisplay = (fichaId) => {
        setSelectedFichaId((prevId) => (prevId === fichaId ? null : fichaId));
    };


    // Mapeamento de nomes de ficha para rotas
const rotasPorNome = {
    "Ficha clínica ortopédica": "/updateFichaOrtopedica",
    "Ficha clínica cardiológica": "/updateFichaCardiologica",
    "Ficha Clínica Médica": "/updateFichaClinicaMedica",
    "Ficha clínico médica de retorno": "/updateFichaMedicaRetorno",
    "Ficha dermatológica de retorno": "/updateFichaDermatologicaRetorno",
    "Ficha de solicitação de citologia": "/updateFichaSolicitacaoCitologia",
    "Ficha clínica dermatológica": "/updateFichaDermatologica",
    "Ficha de Retorno Clínico de Animais Silvestres e Exóticos": "/updateFichaRetornoClinicoSil",
    "Ficha clínica neurológica": "/updateFichaNeurologica",
    "Ficha de sessão": "/updateFichaSessao",
    "Ficha de Reabilitação Integrativa": "/updateFichaReabilitacao",
    "Ficha Solicitação de Exame": "/updateFichaSolicitacaoExame",
    "Ficha Clínica Médica (silvestres ou exóticos)": "/updateFichaClinicaMedicaSilvestres",
    "Ficha Anestesiológica": "/updateFichaAnestesiologia",
    "Ficha de ato cirúrgico": "/updateFichaAtoCirurgico"
};

const handleVisualizar = (ficha) => {
    const basePath = rotasPorNome[ficha.nome];
    if (basePath) {
        const consultaId = id;
        const animalId = consulta?.animal?.id;
        // Redireciona para a página de edição, adicionando o ID da ficha e o modo de visualização
        const urlCorreta = `${basePath}?fichaId=${ficha.id}&animalId=${animalId}&consultaId=${consultaId}&modo=visualizar`;
        console.log("Redirecionando para:", urlCorreta); // Bom para depuração
        router.push(urlCorreta);
    } else {
        console.error(`Rota de visualização não encontrada para a ficha: ${ficha.nome}`);
        alert(`Visualização para "${ficha.nome}" não implementada.`);
    }
};

    // Extrai as fichas do objeto de consulta para facilitar o uso
    const fichasDados = consulta.ficha || [];

    return (
        <div className={styles.container}>
            < VoltarButton />
            <h1>Informações da consulta</h1>
            <ul>
                {consulta && ( 
                    <li key={consulta.id} className={styles.infos_box}>
                        <div className={styles.identificacao}>
                            <div className={styles.nome_animal}>{consulta.animal && consulta.animal.nome}</div>
                            <div className={styles.especie_animal}>Paciente</div>
                        </div>
                        <div className={styles.form}>
                            <div className={styles.box}>
                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Peso atual</h6>
                                        <p>{consulta.pesoAtual}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Queixa principal</h6>
                                        <p>{consulta.queixaPrincipal}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Suspeitas clínicas</h6>
                                        <p>{consulta.suspeitasClinicas}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Veterinário&#40;a&#41;</h6>
                                        <p>{consulta.medico && consulta.medico.nome}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Próxima consula</h6>
                                        <p>{consulta.proximaConsulta === true ? "Retorno" : "Atendimento clínico"}</p>
                                    </div>
                                </div>

                                <div className={styles.lista}>
                                    <div className={styles.infos}>
                                        <h6>Idade Atual</h6>
                                        <p>{consulta.idadeAtual}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Alterações clínicas diversas</h6>
                                        <p>{consulta.alteracoesClinicasDiversas}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Alimentação</h6>
                                        <p>{consulta.alimentacao}</p>
                                    </div>
                                    <div className={styles.infos}>
                                        <h6>Encaminhado&#40;a&#41; por:</h6>
                                        <p>{consulta.medico ? consulta.medico && consulta.medico.nome : "Não possui encaminhamento"}</p>
                                    </div>
                                </div>
                            </div>

                            
                            <div className={styles.box_ficha_toggle}>
                                <button
                                    type="button"
                                    className={`${styles.toggleButton} ${showFichas ? styles.minimize : styles.expand}`}
                                    onClick={() => setShowFichas((prev) => !prev)}
                                    style={{ marginBottom: '0.7rem' }}
                                >
                                    {showFichas ? "Ocultar Fichas Adicionadas" : "Fichas Adicionadas"}
                                </button>
                                {showFichas && (
                                    <div className={styles.ficha_container}>
                                        <div className={styles.form_box}>
                                            <div className={styles.box_ficha_buttons}>
                                                {fichasDados.length > 0 ? (
                                                    fichasDados.map((ficha) => (
                                                        <div key={ficha.id} className={styles.ficha_item}>
                                                            <button
                                                                key={ficha.id}
                                                                className={styles.ficha_button} // Use o estilo de botão que preferir
                                                                onClick={() => handleVisualizar(ficha)}
                                                            >
                                                                Visualizar {ficha.nome}
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className={styles.no_fichas}>Nenhuma ficha associada a esta consulta.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.botao}>
                                <EditarWhiteButton page={"updateConsulta"} id={consulta.id}/>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default GetConsultaById;
