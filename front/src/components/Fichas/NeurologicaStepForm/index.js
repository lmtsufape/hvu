import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Neurologica from "./NeurologicaPostura";
import Neurologica2 from "./NeurologicaNervos";
import Neurologica3 from "./NeurologicaDiagnostico";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { createFicha } from '../../../../services/fichaService';
import { getCurrentUsuario } from '../../../../services/userService';

function NeurologicaSteps() {
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState(null);
    const [roles, setRoles] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    const [consultaId, setConsultaId] = useState(null);
    const router = useRouter();

    console.log("userId:", userId);
    const [formData, setFormData] = useState({

        // página 1
        nivelConsciencia: "",
        resultadoExame: "",
        postura: [],
        descricaoLocomocao: [],
        tipoAtaxia: [],
        andarCompulsivo: "",

        // página 2
        nervosCranianos: {
            ameaca: {
                Esq: "",
                Dir: ""
            },
            tamanhoSimetria: {
                Esq: "",
                Dir: ""
            },
            reflexoPupilar: {
                Esq: "",
                Dir: ""
            },
            posturaOcular: {
                Esq: "",
                Dir: ""
            },
            reflexoOculocefalico: {
                Esq: "",
                Dir: ""
            },
            nistagmoPatologico: {
                Esq: "",
                Dir: ""
            },
            reflexoPalpebral: {
                Esq: "",
                Dir: ""
            },
            sensibilidadeNasal: {
                Esq: "",
                Dir: ""
            },
            historicoDisfoniaDisfagia: {
                Esq: "",
                Dir: ""
            },
            simetriaLingua: {
                Esq: "",
                Dir: ""
            },
            estrabismoPosicional: {
                Esq: "",
                Dir: ""
            },
            simetriaFace: {
                Esq: "",
                Dir: ""
            }
        },
        reacoesPosturais: {
            propriocepcaoConsciente: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            saltitar: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            posicionamentoTatil: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            hemiestacao: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            hemilocomocao: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            carrinhoDeMao: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            correcaoTatil: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            }
        },
        reflexosSegmentares: {
            tonoMuscular: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            patelar: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            flexor: {
                MTD: "",
                MTE: "",
                MPD: "",
                MPE: ""
            },
            perineal: "",
            reflexoCutaneo: "",
            reflexoToracicoLateral: "",
            tonoDaCalda: "",
            miccao: "",
        },
        avaliacaoSensitiva: {
            palpacaoEpaxial: "",
            dorCervical: "",
            sensibilidadeDosMembros: ""
        },

        // página 3
        diagnosticoAnatomico: {
            localLesao: [],
            subniveisMedula: [],
            nervoPeriferico: "",
            suspeitasClinicas: "",
            examesComplementares: "",
            prognostico: "",
            diagnostico: "",
            tratamento: "",
        },
        plantonistasDiscentes: ""
    });

    // Carrega os dados do formulário do localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedFormData = localStorage.getItem("fichaNeurologicaFormData");
            if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
            }
        }
    }, []);

    // Salva os dados do formulário no localStorage 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("fichaNeurologicaFormData", JSON.stringify(formData));
        }
    }, [formData]);

    // Obtém o ID da ficha da URL
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.fichaId;
            if (id) {
                setConsultaId(id);
                console.log("ID da ficha:", id);
            }
        }
    }, [router.isReady, router.query.fichaId]);

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
    //para objetos aninhados
    const handleChange = (event) => {
        const { name, value } = event.target;
        const fieldNames = name.split('.');

        setFormData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));

            let currentLevel = newData;
            for (let i = 0; i < fieldNames.length - 1; i++) {
                if (!currentLevel[fieldNames[i]]) {
                    currentLevel[fieldNames[i]] = {};
                }
                currentLevel = currentLevel[fieldNames[i]];
            }
            currentLevel[fieldNames[fieldNames.length - 1]] = value;

            return newData;
        });
    };

    //para checkbox com valores aninhados
    const handleCheckboxChange = (event, fieldPath) => {
        const { value, checked } = event.target;
        const keys = fieldPath.split(".");

        setFormData((prev) => {
            const updated = { ...prev };
            let pointer = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                pointer[key] = { ...pointer[key] };
                pointer = pointer[key];
            }

            const finalKey = keys[keys.length - 1];
            const currentArray = pointer[finalKey] || [];

            pointer[finalKey] = checked
                ? [...currentArray, value]
                : currentArray.filter((item) => item !== value);

            // Caso especial: quando desmarcar "Medula espinhal", limpar subniveisMedula
            if (fieldPath === "diagnosticoAnatomico.localLesao" && value === "Medula espinhal" && !checked) {
                if (pointer.subniveisMedula) {
                    pointer.subniveisMedula = [];
                }
            }

            return updated;
        });
    };


    const handleSubmit = async (event) => {
        setShowErrorAlert(false);
        const dataFormatada = moment().format("YYYY-MM-DDTHH:mm:ss");
        const fichaData = {
            nome: "Ficha clínica neurológica",
            conteudo: {
                "Nível de Consciência": formData.nivelConsciencia,
                "Resultado do Exame": formData.resultadoExame,
                "Postura": formData.postura,
                "Descrição da Locomoção": formData.descricaoLocomocao,
                "Tipo de Ataxia": formData.tipoAtaxia,
                "Andar Compulsivo": formData.andarCompulsivo,

                "Nervos Cranianos": {
                    "Ameaça (OE/OD)": formData.nervosCranianos.ameaca,
                    "Tamanho e Simetria Pupilar": formData.nervosCranianos.tamanhoSimetria,
                    "Reflexo Pupilar": formData.nervosCranianos.reflexoPupilar,
                    "Postura Ocular": formData.nervosCranianos.posturaOcular,
                    "Reflexo Oculocefálico": formData.nervosCranianos.reflexoOculocefalico,
                    "Nistagmo Patológico": formData.nervosCranianos.nistagmoPatologico,
                    "Reflexo Palpebral": formData.nervosCranianos.reflexoPalpebral,
                    "Sensibilidade Nasal": formData.nervosCranianos.sensibilidadeNasal,
                    "Histórico de Disfonia/Disfagia": formData.nervosCranianos.historicoDisfoniaDisfagia,
                    "Simetria da Língua": formData.nervosCranianos.simetriaLingua,
                    "Estrabismo Posicional": formData.nervosCranianos.estrabismoPosicional,
                    "Simetria Facial": formData.nervosCranianos.simetriaFace
                },

                "Reações Posturais": {
                    "Propriocepção Consciente": formData.reacoesPosturais.propriocepcaoConsciente,
                    "Saltitar": formData.reacoesPosturais.saltitar,
                    "Posicionamento Tátil": formData.reacoesPosturais.posicionamentoTatil,
                    "Hemiestação": formData.reacoesPosturais.hemiestacao,
                    "Hemilocomoção": formData.reacoesPosturais.hemilocomocao,
                    "Carrinho de Mão": formData.reacoesPosturais.carrinhoDeMao,
                    "Correção Tátil": formData.reacoesPosturais.correcaoTatil
                },

                "Reflexos Segmentares": {
                    "Tônus Muscular": formData.reflexosSegmentares.tonoMuscular,
                    "Reflexo Patelar": formData.reflexosSegmentares.patelar,
                    "Reflexo Flexor": formData.reflexosSegmentares.flexor,
                    "Reflexo Perineal": formData.reflexosSegmentares.perineal,
                    "Reflexo Cutâneo": formData.reflexosSegmentares.reflexoCutaneo,
                    "Reflexo Torácico Lateral": formData.reflexosSegmentares.reflexoToracicoLateral,
                    "Tônus da Cauda": formData.reflexosSegmentares.tonoDaCalda,
                    "Micção": formData.reflexosSegmentares.miccao
                },

                "Avaliação Sensitiva": {
                    "Palpação Epaxial": formData.avaliacaoSensitiva.palpacaoEpaxial,
                    "Dor Cervical": formData.avaliacaoSensitiva.dorCervical,
                    "Sensibilidade dos Membros": formData.avaliacaoSensitiva.sensibilidadeDosMembros
                },

                "Diagnóstico Anatômico": {
                    "Local da Lesão": formData.diagnosticoAnatomico.localLesao,
                    "Subníveis da Medula": formData.diagnosticoAnatomico.subniveisMedula,
                    "Nervo Periférico": formData.diagnosticoAnatomico.nervoPeriferico,
                    "Suspeitas Clínicas": formData.diagnosticoAnatomico.suspeitasClinicas,
                    "Exames Complementares": formData.diagnosticoAnatomico.examesComplementares,
                    "Prognóstico": formData.diagnosticoAnatomico.prognostico,
                    "Diagnóstico": formData.diagnosticoAnatomico.diagnostico,
                    "Tratamento": formData.diagnosticoAnatomico.tratamento
                },

                "Plantonistas / Discentes": formData.plantonistasDiscentes
            },
            dataHora: dataFormatada
        };

        try {
            const resultado = await createFicha(fichaData);
            localStorage.setItem('fichaId', resultado.id.toString());
            localStorage.removeItem("fichaNeurologicaFormData");
            setShowAlert(true);
        } catch (error) {
            console.error("Erro ao criar ficha:", error);
            setShowErrorAlert(true);
        }
    };

    const cleanLocalStorage = () => {
        localStorage.removeItem("fichaNeurologicaFormData");
    }

    const renderStepContent = () => {
        switch (step) {
            default:
                return <Neurologica
                    formData={formData}
                    handleChange={handleChange}
                    nextStep={nextStep}
                    handleCheckboxChange={handleCheckboxChange}
                    cleanLocalStorage={cleanLocalStorage}
                />;
            case 1:
                return (
                    <Neurologica
                        formData={formData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        handleCheckboxChange={handleCheckboxChange}
                        cleanLocalStorage={cleanLocalStorage}
                    />
                );
            case 2:
                return (
                    <Neurologica2
                        formData={formData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 3:
                return (
                    <>
                        {showAlert && consultaId &&
                            <div className={styles.alert}>
                                <Alert message="Ficha criada com sucesso!"
                                    show={showAlert} url={`/createConsulta/${consultaId}`} />
                            </div>}
                        {showErrorAlert &&
                            <div className={styles.alert}>
                                <ErrorAlert message={"Erro ao criar ficha"}
                                    show={showErrorAlert} />
                            </div>}

                        <Neurologica3
                            formData={formData}
                            handleChange={handleChange}
                            prevStep={prevStep}
                            handleCheckboxChange={handleCheckboxChange}
                            handleSubmit={handleSubmit}
                        />
                    </>
                );
        }
    }
    return (
        <div className={styles.container}>
            {renderStepContent()}

            <div className={styles.pagination}>
                {[1, 2, 3].map((page) => (
                    <button
                        key={page}
                        className={styles.pageButton}
                        onClick={() => setStep(page)}
                        disabled={step === page}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default NeurologicaSteps;