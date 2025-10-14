import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Neurologica from "./NeurologicaPostura";
import Neurologica2 from "./NeurologicaNervos";
import Neurologica3 from "./NeurologicaDiagnostico";
import styles from "./index.module.css";
import Alert from "../../Alert";
import ErrorAlert from "../../ErrorAlert";
import moment from 'moment';
import { getCurrentUsuario } from '../../../../services/userService';
import { getFichaById } from "../../../../services/fichaService";
import { updateFicha } from "../../../../services/fichaService";
import dynamic from 'next/dynamic';
import NeurologicaPDF from './NeurologicaPDF';
import { getAnimalById } from "../../../../services/animalService";
import { getTutorByAnimal } from "../../../../services/tutorService";
import { getMedicoById } from "../../../../services/medicoService";


function NeurologicaSteps() {

    const router = useRouter(); // Garanta que o router está aqui

    const PDFLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), { ssr: false });
    const DownloadPdfStyledButton = ({ ficha, animal, tutor, medicoLogado }) => (
        <button type="button" className={styles.green_buttonFichas} style={{width: 'auto', padding: '0 1.5rem'}}>
            <PDFLink document={<NeurologicaPDF ficha={ficha} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />} fileName={`FichaNeurologica_${animal.nome?.replace(/\s/g, '_')}.pdf`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {({ loading }) => (loading ? 'Gerando...' : 'Baixar PDF')}
            </PDFLink>
        </button>
    );

    const [animalId, setAnimalId] = useState(null);
    const [animal, setAnimal] = useState({});
    const [tutor, setTutor] = useState({});
    const [medicoLogado, setMedicoLogado] = useState(null);

    useEffect(() => { if (router.isReady) { setAnimalId(router.query.animalId); } }, [router.isReady, router.query.animalId]);

    useEffect(() => {
        const fetchDataForPDF = async () => {
            if (!animalId) return;
            try {
                const [animalData, tutorData, userData] = await Promise.all([getAnimalById(animalId), getTutorByAnimal(animalId), getCurrentUsuario()]);
                setAnimal(animalData);
                setTutor(tutorData);
                if (userData?.usuario?.id) {
                    const medicoData = await getMedicoById(userData.usuario.id);
                    setMedicoLogado(medicoData);
                }
            } catch (error) { console.error('Erro ao buscar dados para o PDF:', error); }
        };
        fetchDataForPDF();
    }, [animalId]);
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
  const [fichaId, setFichaId] = useState(null);
  const [data, setData] = useState([]);
  const [agendamentoId, setAgendamentoId] = useState(null);

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
    nervosCranianos:{
        ameaca:{
            Esq:"",
            Dir:""
        },
        tamanhoSimetria:{
            Esq:"",
            Dir:""
        },
        reflexoPupilar:{
            Esq:"",
            Dir:""
        },
        posturaOcular:{
            Esq:"",
            Dir:""
        },
        reflexoOculocefalico:{
            Esq:"",
            Dir:""
        },
        nistagmoPatologico:{
            Esq:"",
            Dir:""
        },
        reflexoPalpebral:{
            Esq:"",
            Dir:""
        },
        sensibilidadeNasal:{
            Esq:"",
            Dir:""
        },
        historicoDisfoniaDisfagia:{
            Esq:"",
            Dir:""
        },
        simetriaLingua:{
            Esq:"",
            Dir:""
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
    reacoesPosturais:{
        propriocepcaoConsciente:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        saltitar:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        posicionamentoTatil:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        hemiestacao:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        hemilocomocao:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        carrinhoDeMao:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        correcaoTatil:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        }
    },
    reflexosSegmentares:{
        tonoMuscular:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        patelar:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        flexor:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        perineal:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        reflexoCutaneo:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        reflexoToracicoLateral:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        tonoDaCalda:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
        miccao:{
            MTD:"",
            MTE:"",
            MPD:"",
            MPE:""
        },
    },
    avaliacaoSensitiva:{
        palpacaoEpaxial:"",
        dorCervical:"",
        sensibilidadeDosMembros:""
    },

    // página 3
    diagnosticoAnatomico:{
        localLesao:[],
        subniveisMedula: [],
        nervoPeriferico:"",
        suspeitasClinicas:"",
        examesComplementares:"",
        prognostico:"",
        diagnostico:"",
        tratamento:"",
    },
    plantonistasDiscentes:"",
    medicosResponsaveis:""
  });

    // Obtém o ID da ficha da URL
    useEffect(() => {
        if (router.isReady) {
            const id = router.query.consultaId;
            const ficha = router.query.fichaId;
            const agendamentoId = router.query.agendamentoId;
            if (id) {
                setConsultaId(id);
            }
            if (ficha) {
                setFichaId(ficha);
            }
            if (agendamentoId) {
                setAgendamentoId(agendamentoId);
            }
        }
    }, [router.isReady, router.query.consultaId]);

    useEffect(() => {
    if (!fichaId) return;

    const fetchData = async () => {
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
    }, [fichaId]);

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
  if (!roles.includes("medico") && !roles.includes("patologista")) {
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
    const dataFormatada = moment(data).format("YYYY-MM-DDTHH:mm:ss"); 
    const fichaData = {
        nome: "Ficha clínica neurológica",  
        conteudo:{
            nivelConsciencia: formData.nivelConsciencia,
            resultadoExame: formData.resultadoExame,
            postura: formData.postura,
            descricaoLocomocao: formData.descricaoLocomocao,
            tipoAtaxia: formData.tipoAtaxia,
            andarCompulsivo: formData.andarCompulsivo,

            nervosCranianos: formData.nervosCranianos,
            reacoesPosturais: formData.reacoesPosturais,
            reflexosSegmentares: formData.reflexosSegmentares,
            avaliacaoSensitiva: formData.avaliacaoSensitiva,

            diagnosticoAnatomico:formData.diagnosticoAnatomico,
            plantonistasDiscentes: formData.plantonistasDiscentes,
        },
        dataHora: dataFormatada,
        agendamento: { id: Number(agendamentoId) }
    };

    try {
        await updateFicha(fichaData, fichaId);
        setShowAlert(true);
    } catch (error) {
        console.error("Erro ao criar ficha:", error);
        setShowErrorAlert(true);
    }
 };

    const renderStepContent = () => {
        switch(step) {
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
                <Alert message="Ficha editada com sucesso!" 
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

          <div className={styles.footerControls}>
            {!loading && animal.id && tutor.id && medicoLogado && (
                <DownloadPdfStyledButton ficha={formData} animal={animal} tutor={tutor} medicoLogado={medicoLogado} />
            )}
        </div>
    
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